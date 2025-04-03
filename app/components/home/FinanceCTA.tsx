'use client';

import Link from 'next/link';
import GlassCard from '../ui/glass-card';
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, Check } from 'lucide-react';

const FinanceCTA = () => {
  return (
    <div className="py-16 bg-gradient-to-b from-transparent to-blue-950/20">
      <div className="container mx-auto px-4">
        <GlassCard 
          intensity="light" 
          className="p-8 md:p-12 max-w-5xl mx-auto border-t border-blue-500/30"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Financial Life?
              </h2>
              
              <p className="text-white/80 text-lg max-w-2xl">
                Join thousands of satisfied users who have achieved their financial goals with FinePilot&apos;s personal finance management platform.
              </p>
              
              <ul className="mt-6 space-y-2 text-left max-w-md mx-auto lg:mx-0">
                {['Smart budgeting tools', 'Expense categorization', 'Financial insights', 'Goal tracking', 'Investment monitoring'].map((feature) => (
                  <li key={feature} className="flex items-center text-white/90">
                    <Check className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex flex-col gap-4 w-full lg:w-auto lg:min-w-[240px]">
              <SignedIn>
                <Link href="/banking/dashboard">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 w-full transition-colors duration-300">
                    <span>Go to Dashboard</span>
                    <ArrowRight size={18} />
                  </button>
                </Link>
              </SignedIn>
              
              <SignedOut>
                <Link href="/sign-up">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 w-full transition-colors duration-300">
                    <span>Start for Free</span>
                    <ArrowRight size={18} />
                  </button>
                </Link>
                
                <Link href="/sign-in">
                  <button className="bg-transparent hover:bg-white/5 text-white px-6 py-3 rounded-md font-medium w-full transition-colors duration-300 border border-white/20">
                    Sign In
                  </button>
                </Link>
              </SignedOut>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default FinanceCTA;