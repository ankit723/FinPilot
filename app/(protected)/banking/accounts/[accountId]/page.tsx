import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TransactionForm from "./transaction-form";

interface AccountPageProps {
  params: Promise<{
    accountId: string;
  }>;
}

export default async function AccountDetailPage(props: AccountPageProps) {
  const { userId } = await auth();
  const params = await props.params;
  const { accountId } = params;
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  // Get user's role
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      customer: true,
    },
  });
  
  if (!user) {
    redirect("/");
  }
  
  const isEmployee = user.role === "EMPLOYEE" || user.role === "ADMIN";
  
  // Get account details with transactions
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: {
      customer: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
      transactions: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  
  if (!account) {
    redirect("/banking/accounts");
  }
  
  // Check authorization - user must be the account owner or an employee/admin
  if (!isEmployee && account.customer.user.id !== userId) {
    redirect("/banking/accounts");
  }
  
  // Calculate total deposits and withdrawals
  const totalDeposits = account.transactions
    .filter(t => t.type === "DEPOSIT")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalWithdrawals = account.transactions
    .filter(t => t.type === "WITHDRAWAL")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/banking/accounts" className="text-sm text-muted-foreground hover:underline mb-2 inline-block">
            ← Back to Accounts
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {account.type === "SAVINGS" ? "Savings Account" : 
             account.type === "CURRENT" ? "Current Account" :
             "Fixed Deposit"}
          </h1>
          <p className="text-muted-foreground">{account.accountNumber}</p>
        </div>
        {account.status === "ACTIVE" && (
          <div className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm rounded-full">
            Active
          </div>
        )}
        {account.status === "CLOSED" && (
          <div className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-sm rounded-full">
            Closed
          </div>
        )}
        {account.status === "SUSPENDED" && (
          <div className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-sm rounded-full">
            Suspended
          </div>
        )}
      </div>
      
      {/* Fixed Deposit Details */}
      {account.type === "FIXED_DEPOSIT" && account.tenure && account.maturityDate && (
        <Card className="mb-6 bg-primary/5">
          <CardHeader>
            <CardTitle>Fixed Deposit Details</CardTitle>
            <CardDescription>
              Information about your fixed deposit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Principal Amount</p>
                <p className="text-lg font-semibold">₹{account.balance.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interest Rate</p>
                <p className="text-lg font-semibold">{account.interestRate}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tenure</p>
                <p className="text-lg font-semibold">{account.tenure} months</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Maturity Date</p>
                <p className="text-lg font-semibold">{new Date(account.maturityDate).toLocaleDateString()}</p>
              </div>
              
              <div className="md:col-span-4 mt-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Maturity Value: </span>
                  Approximately ₹{(account.balance * (1 + (account.interestRate! / 100) * (account.tenure / 12))).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Note: Early withdrawal may result in reduced interest rates and penalties.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{account.balance.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Deposits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ₹{totalDeposits.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Withdrawals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              ₹{totalWithdrawals.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 mt-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Recent account activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {account.transactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No transactions found for this account.
                </p>
              ) : (
                <div className="space-y-4">
                  {account.transactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <div className="flex items-center">
                          {transaction.type === "DEPOSIT" ? (
                            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
                                <path d="m5 12 7-7 7 7"/>
                                <path d="M12 19V5"/>
                              </svg>
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-400">
                                <path d="M12 5v14"/>
                                <path d="m5 12 7 7 7-7"/>
                              </svg>
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{transaction.type}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(transaction.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div 
                          className={`font-medium ${
                            transaction.type === "DEPOSIT" 
                              ? "text-green-600 dark:text-green-400" 
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {transaction.type === "DEPOSIT" ? "+" : "-"}
                          ₹{transaction.amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground text-right">
                          {transaction.reference}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {account.status === "ACTIVE" && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>New Transaction</CardTitle>
                <CardDescription>
                  Deposit or withdraw funds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionForm account={account} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      {isEmployee && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>
                Administrative actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Customer</p>
                    <p>{account.customer.user.firstName} {account.customer.user.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{account.customer.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p>{account.customer.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created On</p>
                    <p>{new Date(account.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  {account.status === "ACTIVE" && (
                    <>
                      <form action={`/api/banking/accounts/${account.id}`} method="PATCH">
                        <input type="hidden" name="status" value="SUSPENDED" />
                        <Button variant="outline" type="submit">Suspend Account</Button>
                      </form>
                      <form action={`/api/banking/accounts/${account.id}`} method="PATCH">
                        <input type="hidden" name="status" value="CLOSED" />
                        <Button variant="destructive" type="submit">Close Account</Button>
                      </form>
                    </>
                  )}
                  
                  {account.status === "SUSPENDED" && (
                    <form action={`/api/banking/accounts/${account.id}`} method="PATCH">
                      <input type="hidden" name="status" value="ACTIVE" />
                      <Button variant="outline" type="submit">Reactivate Account</Button>
                    </form>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 