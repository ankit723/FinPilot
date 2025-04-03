"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";

interface ProfileCompletionCardProps {
  hasCustomerProfile: boolean;
  firstName: string;
}

export default function ProfileCompletionCard({
  hasCustomerProfile,
  firstName,
}: ProfileCompletionCardProps) {
  // If profile is complete, show success state
  if (hasCustomerProfile) {
    return (
      <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
            <CardTitle className="text-green-700 dark:text-green-400">Profile Complete</CardTitle>
          </div>
          <CardDescription className="text-green-600 dark:text-green-300">
            Your banking profile is complete
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-600 dark:text-green-300">
            Thanks for completing your profile, {firstName}! You now have access to all banking features.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // If profile is incomplete, show progress and action
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-amber-600 mr-2" />
          <CardTitle>Complete Your Profile</CardTitle>
        </div>
        <CardDescription>
          Finish setting up your banking profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Profile completion</span>
              <span className="text-sm">50%</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>
          
          <p className="text-sm text-muted-foreground">
            Complete your profile to unlock all banking services including accounts, transactions, and loans.
          </p>
          
          <Link href="/banking/profile">
            <Button className="w-full">Complete Now</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 