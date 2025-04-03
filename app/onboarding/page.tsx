import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";

export default async function OnboardingPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // Check if user exists in database
  let dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      customer: true,
    },
  });

  // If user doesn't exist in the database, create them
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: userId,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        profileImage: user.imageUrl || `https://avatar.vercel.sh/${user.firstName || "user"}-${user.lastName || "profile"}.svg`,
        role: "CUSTOMER", // Default role
      },
      include: {
        customer: true,
      },
    });
  }

  // If user already has a customer profile, redirect to dashboard
  if (dbUser?.customer) {
    redirect("/banking/dashboard");
  }

  // Calculate what steps are completed
  const steps = [
    {
      id: "account",
      title: "Account Created",
      description: "Your account has been created successfully.",
      completed: true,
    },
    {
      id: "profile",
      title: "Complete Your Profile",
      description: "Provide basic information about yourself.",
      completed: false,
      href: "/banking/profile",
    },
    {
      id: "banking",
      title: "Explore Financial Tools",
      description: "Start using banking services and features.",
      completed: false,
      href: "/banking/dashboard",
    },
  ];

  return (
    <div className="container max-w-3xl mx-auto py-16 px-4">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to FinePilot</h1>
          <p className="text-muted-foreground mt-2">
            Complete the following steps to get started
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Onboarding Progress</CardTitle>
            <CardDescription>
              Your account has been created. Now let&apos;s complete your profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={step.id} className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className={`rounded-full p-1 ${step.completed ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"} flex items-center justify-center h-8 w-8`}>
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="h-full w-px bg-border my-1" />
                    )}
                  </div>
                  <div className="pb-8 pt-1 space-y-2">
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                    {!step.completed && step.href && (
                      <Link href={step.href}>
                        <Button>
                          {index === 1 ? "Complete Profile" : "Continue"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link href="/banking/profile">
            <Button size="lg">
              Continue to Profile Setup
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 