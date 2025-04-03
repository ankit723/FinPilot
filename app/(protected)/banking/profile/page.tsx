import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import ProfileForm from "./profile-form";
import GlassCard from "@/app/components/ui/glass-card";

export default async function ProfilePage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // Check if customer profile exists
  const customer = await prisma.customer.findFirst({
    where: { userId },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Profile</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Your user account information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">First Name</p>
                  <p>{user.firstName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                  <p>{user.lastName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{user.emailAddresses[0]?.emailAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p className="text-sm truncate">{userId}</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm text-muted-foreground">
                  To update your user information, click the avatar icon in the top-right corner.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {customer ? "Customer Profile" : "Complete Your Customer Profile"}
            </CardTitle>
            <CardDescription>
              {customer 
                ? "Your banking profile information" 
                : "Complete your profile to access banking services"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm initialData={customer} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 