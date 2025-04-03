import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AccountsPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // Get user role
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      customer: true,
    },
  });

  if (!dbUser) {
    redirect("/");
  }

  const isEmployee = dbUser.role === "EMPLOYEE" || dbUser.role === "ADMIN";

  // Load accounts based on role
  let accounts = [];
  if (isEmployee) {
    // Employees can see all accounts
    accounts = await prisma.account.findMany({
      include: {
        customer: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        transactions: {
          take: 3,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    // Customers can only see their accounts
    if (!dbUser.customer) {
      redirect("/banking/profile");
    }

    accounts = await prisma.account.findMany({
      where: {
        customerId: dbUser.customer.id,
      },
      include: {
        customer: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        transactions: {
          take: 3,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {isEmployee ? "All Accounts" : "Your Accounts"}
        </h1>
        {!isEmployee && (
          <Link href="/banking/accounts/new">
            <Button>Open New Account</Button>
          </Link>
        )}
      </div>

      <div className="space-y-6">
        {accounts.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Accounts Found</CardTitle>
              <CardDescription>
                {isEmployee
                  ? "No accounts have been created yet."
                  : "You don't have any accounts yet."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isEmployee && (
                <div className="flex justify-center mt-4">
                  <Link href="/banking/accounts/new">
                    <Button>Open Your First Account</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accounts.map((account) => (
              <Card key={account.id} className="overflow-hidden">
                <CardHeader className="bg-muted/20">
                  <CardTitle>
                    {account.type === "SAVINGS"
                      ? "Savings Account"
                      : account.type === "CURRENT"
                      ? "Current Account"
                      : "Fixed Deposit"}
                  </CardTitle>
                  <CardDescription>
                    {account.accountNumber}
                    {account.type === "FIXED_DEPOSIT" && account.tenure && (
                      <span className="block mt-1">
                        {account.tenure} months at {account.interestRate}% p.a.
                      </span>
                    )}
                    {isEmployee && account.customer?.user && (
                      <span className="block mt-1">
                        Owner: {account.customer.user.firstName}{" "}
                        {account.customer.user.lastName}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-2xl font-bold">
                      ₹{account.balance.toFixed(2)}
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        account.status === "ACTIVE"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : account.status === "CLOSED"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {account.status}
                    </div>
                  </div>

                  {account.type === "FIXED_DEPOSIT" && account.maturityDate && (
                    <div className="mt-2 text-sm">
                      <p className="text-muted-foreground">
                        Matures on: {new Date(account.maturityDate).toLocaleDateString()}
                      </p>
                      <p className="text-muted-foreground mt-1">
                        Maturity Value: ₹{(account.balance * (1 + (account.interestRate! / 100) * (account.tenure! / 12))).toFixed(2)}
                      </p>
                    </div>
                  )}

                  {account.transactions && account.transactions.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Recent Transactions</h3>
                      <div className="space-y-2">
                        {account.transactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <div className="flex items-center">
                              <span
                                className={`w-2 h-2 mr-2 rounded-full ${
                                  transaction.type === "DEPOSIT"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              ></span>
                              <span>
                                {transaction.type}{" "}
                                <span className="text-muted-foreground">
                                  {new Date(transaction.createdAt).toLocaleDateString()}
                                </span>
                              </span>
                            </div>
                            <span
                              className={
                                transaction.type === "DEPOSIT"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }
                            >
                              {transaction.type === "DEPOSIT" ? "+" : "-"}₹
                              {transaction.amount.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <Link href={`/banking/accounts/${account.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 