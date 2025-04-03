import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function LoansPage() {
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

  // Load loans based on role
  let loans = [];
  if (isEmployee) {
    // Employees can see all loans
    loans = await prisma.loan.findMany({
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
        payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    // Customers can only see their loans
    if (!dbUser.customer) {
      redirect("/banking/profile");
    }

    loans = await prisma.loan.findMany({
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
        payments: true,
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
          {isEmployee ? "All Loans" : "Your Loans"}
        </h1>
        {!isEmployee && (
          <Link href="/banking/apply-loan">
            <Button>Apply for Loan</Button>
          </Link>
        )}
      </div>

      <div className="space-y-6">
        {loans.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Loans Found</CardTitle>
              <CardDescription>
                {isEmployee
                  ? "No loans have been created yet."
                  : "You don't have any loans yet."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isEmployee && (
                <div className="flex justify-center mt-4">
                  <Link href="/banking/apply-loan">
                    <Button>Apply for a Loan</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loans.map((loan) => {
              // Calculate total amount paid
              const totalPaid = loan.payments.reduce(
                (sum, payment) => sum + payment.amount,
                0
              );
              
              // Calculate remaining amount
              const remainingAmount = loan.amount - totalPaid;
              
              // Calculate progress percentage
              const progressPercentage = Math.min(
                (totalPaid / loan.amount) * 100,
                100
              );

              return (
                <Card key={loan.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Loan #{loan.loanNumber}</CardTitle>
                        <CardDescription>
                          {isEmployee && loan.customer?.user && (
                            <span className="block mt-1">
                              Borrower: {loan.customer.user.firstName}{" "}
                              {loan.customer.user.lastName}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs ${
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
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Loan Amount
                        </h3>
                        <p className="text-lg font-semibold">${loan.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Interest Rate
                        </h3>
                        <p className="text-lg font-semibold">{loan.interest}%</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Remaining
                        </h3>
                        <p className="text-lg font-semibold">${remainingAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Term
                        </h3>
                        <p className="text-lg font-semibold">{loan.term} months</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Link href={`/banking/loans/${loan.id}`}>
                        <Button variant="outline">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 