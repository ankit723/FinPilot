import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function TransactionsPage() {
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

  // Load transactions based on role
  let transactions = [];
  if (isEmployee) {
    // Employees can see all transactions
    transactions = await prisma.transaction.findMany({
      include: {
        account: {
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
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100, // Limit to the most recent 100 transactions
    });
  } else {
    // Customers can only see their transactions
    if (!dbUser.customer) {
      redirect("/banking/profile");
    }

    // Get all customer's account IDs
    const accounts = await prisma.account.findMany({
      where: {
        customerId: dbUser.customer.id,
      },
      select: {
        id: true,
      },
    });

    const accountIds = accounts.map((account) => account.id);

    transactions = await prisma.transaction.findMany({
      where: {
        accountId: {
          in: accountIds,
        },
      },
      include: {
        account: {
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
          {isEmployee ? "All Transactions" : "Your Transactions"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            {isEmployee
              ? "Recent transactions across all accounts"
              : "Your recent account transactions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No transactions found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Date</th>
                    <th className="text-left py-2 font-medium">Type</th>
                    <th className="text-left py-2 font-medium">Amount</th>
                    <th className="text-left py-2 font-medium">Account</th>
                    {isEmployee && (
                      <th className="text-left py-2 font-medium">Customer</th>
                    )}
                    <th className="text-left py-2 font-medium">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b">
                      <td className="py-2">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2">
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            transaction.type === "DEPOSIT"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {transaction.type}
                        </div>
                      </td>
                      <td
                        className={`py-2 ${
                          transaction.type === "DEPOSIT"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {transaction.type === "DEPOSIT" ? "+" : "-"}₹
                        {transaction.amount.toFixed(2)}
                      </td>
                      <td className="py-2">
                        <Link
                          href={`/banking/accounts/${transaction.accountId}`}
                          className="hover:underline text-blue-600 dark:text-blue-400"
                        >
                          {transaction.account.accountNumber}
                        </Link>
                      </td>
                      {isEmployee && (
                        <td className="py-2">
                          {transaction.account.customer?.user?.firstName}{" "}
                          {transaction.account.customer?.user?.lastName}
                        </td>
                      )}
                      <td className="py-2 text-muted-foreground text-sm">
                        {transaction.reference}
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
  );
} 