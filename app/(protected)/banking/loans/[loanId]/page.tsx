import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LoanPaymentForm from "./loan-payment-form";

interface LoanDetailPageProps {
  params: Promise<{
    loanId: string;
  }>;
}

export default async function LoanDetailPage(props: LoanDetailPageProps) {
  const { userId } = await auth();
  const params = await props.params;
  const { loanId } = params;
  
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
  
  // Get loan details with payments
  const loan = await prisma.loan.findUnique({
    where: { id: loanId },
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
      payments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  
  if (!loan) {
    redirect("/banking/loans");
  }
  
  // Check authorization - user must be the loan owner or an employee/admin
  if (!isEmployee && loan.customer.user.id !== userId) {
    redirect("/banking/loans");
  }
  
  // Calculate loan statistics
  const totalPaid = loan.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = loan.amount - totalPaid;
  const progressPercentage = Math.min((totalPaid / loan.amount) * 100, 100);
  
  // Calculate monthly payment using the formula: P = (r*PV)/(1-(1+r)^-n)
  const monthlyRate = loan.interest / 12 / 100;
  const denominator = 1 - Math.pow(1 + monthlyRate, -loan.term);
  let monthlyPayment = 0;
  
  if (denominator !== 0) {
    monthlyPayment = (monthlyRate * loan.amount) / denominator;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/banking/loans" className="text-sm text-muted-foreground hover:underline mb-2 inline-block">
            ← Back to Loans
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Loan #{loan.loanNumber}</h1>
          <p className="text-muted-foreground">
            Applied on {new Date(loan.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs ${
            loan.status === "ACTIVE"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : loan.status === "PAID"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              : loan.status === "OVERDUE"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              : loan.status === "PENDING"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
          }`}
        >
          {loan.status}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
            <CardDescription>
              Loan terms and conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Loan Amount</p>
                <p className="text-lg font-semibold">${loan.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interest Rate</p>
                <p className="text-lg font-semibold">{loan.interest}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Term</p>
                <p className="text-lg font-semibold">{loan.term} months</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Payment</p>
                <p className="text-lg font-semibold">${monthlyPayment.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm mb-1">
                <span>Repayment Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid</p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                  ${totalPaid.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Remaining</p>
                <p className="text-lg font-semibold">
                  ${remainingAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {(loan.status === "ACTIVE" || loan.status === "OVERDUE") && (
          <Card>
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
              <CardDescription>
                Pay towards your loan balance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoanPaymentForm loan={loan} />
            </CardContent>
          </Card>
        )}
        
        {loan.status === "PENDING" && (
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>
                Your loan application is being reviewed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-md">
                  <p className="text-yellow-800 dark:text-yellow-200">
                    Your loan application is currently under review. We&apos;ll notify you once a decision has been made.
                  </p>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Typical review time is 1-2 business days. If you have any questions, please contact our customer support.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {loan.status === "PAID" && (
          <Card>
            <CardHeader>
              <CardTitle>Loan Completed</CardTitle>
              <CardDescription>
                This loan has been fully paid
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-md">
                  <p className="text-green-800 dark:text-green-200">
                    Congratulations! You have successfully paid off this loan.
                  </p>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Thank you for your timely payments. You may now apply for a new loan if needed.
                </p>
                
                <div className="pt-2">
                  <Link href="/banking/apply-loan">
                    <Button variant="outline" className="w-full">Apply for Another Loan</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              Record of all payments made towards this loan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loan.payments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No payments have been made on this loan yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Date</th>
                      <th className="text-left py-2 font-medium">Amount</th>
                      <th className="text-left py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loan.payments.map((payment) => (
                      <tr key={payment.id} className="border-b">
                        <td className="py-2">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2 text-green-600 dark:text-green-400">
                          ${payment.amount.toFixed(2)}
                        </td>
                        <td className="py-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
                            Processed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {isEmployee && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Administrative Actions</CardTitle>
              <CardDescription>
                Manage loan status (employee only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Customer</p>
                    <p>{loan.customer.user.firstName} {loan.customer.user.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{loan.customer.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p>{loan.customer.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                    <p>{loan.status}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4 border-t pt-4">
                  {loan.status === "PENDING" && (
                    <>
                      <form action={`/api/banking/loans/${loan.id}`} method="PATCH">
                        <input type="hidden" name="status" value="ACTIVE" />
                        <Button variant="outline" type="submit">Approve Loan</Button>
                      </form>
                      <form action={`/api/banking/loans/${loan.id}`} method="PATCH">
                        <input type="hidden" name="status" value="REJECTED" />
                        <Button variant="destructive" type="submit">Reject Loan</Button>
                      </form>
                    </>
                  )}
                  
                  {loan.status === "ACTIVE" && (
                    <>
                      <form action={`/api/banking/loans/${loan.id}`} method="PATCH">
                        <input type="hidden" name="status" value="OVERDUE" />
                        <Button variant="outline" type="submit">Mark as Overdue</Button>
                      </form>
                    </>
                  )}
                  
                  {loan.status === "OVERDUE" && (
                    <>
                      <form action={`/api/banking/loans/${loan.id}`} method="PATCH">
                        <input type="hidden" name="status" value="ACTIVE" />
                        <Button variant="outline" type="submit">Mark as Active</Button>
                      </form>
                    </>
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