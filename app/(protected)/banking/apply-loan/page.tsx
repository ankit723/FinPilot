import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import LoanApplicationForm from "./loan-application-form";

export default async function ApplyLoanPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // Check if customer profile exists
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      customer: true,
    },
  });

  if (!dbUser) {
    redirect("/");
  }

  // Redirect to profile page if customer profile doesn't exist
  if (!dbUser.customer) {
    redirect("/banking/profile");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/banking/loans" className="text-sm text-muted-foreground hover:underline mb-2 inline-block">
            ← Back to Loans
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Apply for a Loan</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Application</CardTitle>
          <CardDescription>
            Please provide the details for your loan application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoanApplicationForm customer={dbUser.customer} />
        </CardContent>
      </Card>
    </div>
  );
} 