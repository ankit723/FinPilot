import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NewAccountForm from "./new-account-form";

export default async function NewAccountPage() {
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
        <h1 className="text-2xl font-bold tracking-tight">Open New Account</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Account Details</CardTitle>
          <CardDescription>
            Choose the type of account you want to open
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewAccountForm customer={dbUser.customer} />
        </CardContent>
      </Card>
    </div>
  );
} 