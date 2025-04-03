"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import GlassCard from "@/app/components/ui/glass-card";
import NeonText from "@/app/components/ui/neon-text";
import NeoBorder from "@/app/components/ui/neo-border";

interface ProfileStatusProps {
  hasCustomerProfile: boolean;
  firstName: string;
  lastName: string;
}

export default function ProfileStatus({
  hasCustomerProfile,
  firstName,
  lastName,
}: ProfileStatusProps) {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  // Handle initial load and localStorage access safely
  useEffect(() => {
    setMounted(true);
    const savedDismissed = localStorage.getItem("profile-alert-dismissed");
    if (savedDismissed) {
      setDismissed(true);
    }
  }, []);
  
  const handleDismiss = () => {
    localStorage.setItem("profile-alert-dismissed", "true");
    setDismissed(true);
  };
  
  // Don't render anything during SSR to avoid hydration mismatch
  if (!mounted) return null;
  
  // No need to show if profile is complete or alert was dismissed
  if (hasCustomerProfile || dismissed) {
    return null;
  }
  
  // Calculate profile completion percentage
  const completionPercentage = 50; // 50% because they have Clerk profile but not customer profile
  
  return (
    <GlassCard intensity="light" className="mb-4 border-none relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 to-amber-500" />
      <div className="p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-400 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <NeonText color="white" size="lg" className="mb-1">
            Complete your profile
          </NeonText>
          <div className="space-y-3 text-white/80">
            <p>
              Hi {firstName || "there"}, please complete your customer profile to unlock all banking features.
            </p>
            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full transition-all duration-1000"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-xs font-medium text-amber-300">{completionPercentage}%</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <Link href="/banking/profile">
                <NeoBorder color="blue" variant="subtle">
                  <button className="px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white text-sm rounded-md transition-colors">
                    Complete Profile
                  </button>
                </NeoBorder>
              </Link>
              <button 
                className="px-4 py-2 bg-transparent text-white/70 hover:text-white text-sm rounded-md transition-colors"
                onClick={handleDismiss}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
} 