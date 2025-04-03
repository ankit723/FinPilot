import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import ThemeToggle from "@/app/components/ui/theme-toggle";
import Sidebar from "./components/sidebar";
import { prisma } from "@/lib/prisma";
import ProfileStatusWrapper from "./components/profile-status-wrapper";
import GradientBackground from '@/app/components/ui/gradient-background';
import GlassCard from '@/app/components/ui/glass-card';
import ProfessionalText from '@/app/components/ui/neon-text';

export default async function BankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // Get user and check if they have a customer profile
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      customer: true,
    },
  });

  if (!dbUser) {
    // This shouldn't happen if middleware/auth callback is working correctly
    // But just in case, let's redirect to sign-in
    redirect("/sign-in");
  }

  const hasCustomerProfile = !!dbUser.customer;

  return (
    <GradientBackground variant="navy" animated>
      <div className="min-h-screen flex flex-col">
        <GlassCard intensity="medium" className="border-none mb-4">
          <header className="flex items-center justify-between p-4">
            <div className="flex items-center gap-x-3">
              <Link href="/" className="flex items-center gap-x-2">
                <ProfessionalText color="blue" size="xl" className="font-semibold">
                  FinePilot
                </ProfessionalText>
              </Link>
            </div>
            <div className="flex items-center gap-x-4">
              <ThemeToggle />
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: {
                      height: 36,
                      width: 36,
                    },
                  },
                }}
              />
            </div>
          </header>
        </GlassCard>
        
        <div className="flex flex-1 gap-4">
          <div className="w-64 hidden md:block">
            <GlassCard intensity="light" className="h-full p-4 border-none">
              <Sidebar />
            </GlassCard>
          </div>
          
          <div className="flex-1">
            <GlassCard intensity="light" className="p-4 border-none mb-4">
              <ProfileStatusWrapper 
                hasCustomerProfile={hasCustomerProfile}
                firstName={user.firstName || ""}
                lastName={user.lastName || ""}
              />
            </GlassCard>
            
            <div className="mt-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
} 