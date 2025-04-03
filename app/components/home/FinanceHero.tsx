'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlassCard from '../ui/glass-card';
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, PiggyBank, Shield, ChevronRight, BarChart3, Wallet, CreditCard } from 'lucide-react';
import ThemeToggle from '../ui/theme-toggle';
import { useTheme } from 'next-themes';

const FloatingIcons = () => {
  const { theme } = useTheme();
  const isDark = theme !== 'light';
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated floating icons */}
      <div className="absolute top-[15%] left-[10%] animate-float" style={{ animationDelay: '0s' }}>
        <div className={`${isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'} backdrop-blur-sm p-3 rounded-lg`}>
          <Wallet className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
      </div>
      <div className="absolute top-[25%] right-[15%] animate-float" style={{ animationDelay: '1.5s' }}>
        <div className={`${isDark ? 'bg-indigo-500/20' : 'bg-indigo-500/10'} backdrop-blur-sm p-3 rounded-lg`}>
          <Shield className={`h-6 w-6 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
        </div>
      </div>
      <div className="absolute bottom-[20%] left-[20%] animate-float" style={{ animationDelay: '2.5s' }}>
        <div className={`${isDark ? 'bg-teal-500/20' : 'bg-teal-500/10'} backdrop-blur-sm p-3 rounded-lg`}>
          <BarChart3 className={`h-6 w-6 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
        </div>
      </div>
      
      {/* Abstract shapes */}
      <div className="absolute top-[40%] right-[5%] w-32 h-32 bg-gradient-to-r from-blue-600/10 to-teal-600/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-[10%] right-[25%] w-40 h-40 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Decorative grid line */}
      <div className={`absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent ${isDark ? 'via-blue-500/20' : 'via-blue-600/20'} to-transparent`} />
    </div>
  );
};

const FinanceHero = () => {
  const { theme } = useTheme();
  const isDark = theme !== 'light';
  
  useEffect(() => {
    // Component mount effect if needed in the future
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center text-center px-4 py-24 lg:py-32 overflow-hidden">
      {/* Theme toggle button */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      
      {/* Floating icons and decoration */}
      <FloatingIcons />
      
      <div className="max-w-5xl mx-auto z-10 relative">
        <div className="mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className={`h-10 w-10 rounded-full ${isDark ? 'bg-blue-600/20' : 'bg-blue-600/10'} backdrop-blur-sm flex items-center justify-center border ${isDark ? 'border-blue-500/30' : 'border-blue-500/20'} mr-2`}>
              <PiggyBank className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div className={`h-px w-12 bg-gradient-to-r from-blue-500/50 to-transparent`}></div>
            <div className={`h-10 w-10 rounded-full ${isDark ? 'bg-purple-600/20' : 'bg-purple-600/10'} backdrop-blur-sm flex items-center justify-center border ${isDark ? 'border-purple-500/30' : 'border-purple-500/20'} mx-2`}>
              <Shield className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div className={`h-px w-12 bg-gradient-to-r from-transparent to-teal-500/50`}></div>
            <div className={`h-10 w-10 rounded-full ${isDark ? 'bg-teal-600/20' : 'bg-teal-600/10'} backdrop-blur-sm flex items-center justify-center border ${isDark ? 'border-teal-500/30' : 'border-teal-500/20'} ml-2`}>
              <BarChart3 className={`h-5 w-5 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
            </div>
          </div>
          
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>FinePilot</span> <br className="md:hidden" />
            <span className="text-2xl md:text-3xl lg:text-4xl block mt-2">Your Personal Finance Manager</span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
            Smart tools to help you budget, save, and achieve your financial goals
          </p>
        </div>
        
        <div className="mt-10 relative">
          {/* Decorative dot patterns */}
          <div className="absolute -top-10 -left-10 w-20 h-20 grid grid-cols-3 gap-2 opacity-20 -z-1">
            {[...Array(9)].map((_, i) => (
              <div key={i} className={`h-1 w-1 rounded-full ${isDark ? 'bg-white' : 'bg-slate-700'}`}></div>
            ))}
          </div>
          <div className="absolute -bottom-10 -right-10 w-20 h-20 grid grid-cols-3 gap-2 opacity-20 -z-1">
            {[...Array(9)].map((_, i) => (
              <div key={i} className={`h-1 w-1 rounded-full ${isDark ? 'bg-white' : 'bg-slate-700'}`}></div>
            ))}
          </div>
          
          <GlassCard 
            intensity="light" 
            className={`p-6 md:p-8 max-w-2xl mx-auto border ${isDark ? 'border-white/10' : 'border-slate-200'} relative`}>
            <div className="flex flex-col gap-4">
              <p className={isDark ? 'text-white/80 text-lg' : 'text-slate-700 text-lg'}>
                Take control of your finances with our all-in-one platform for budgeting, expense tracking, goal setting, and financial insights.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <SignedIn>
                  <Link href="/banking/dashboard">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300 flex items-center gap-2 group">
                      Go to Dashboard
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </SignedIn>
                
                <SignedOut>
                  <Link href="/sign-in">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-300 flex items-center gap-2 group">
                      Sign In
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link href="/sign-up">
                    <button className={`bg-transparent px-6 py-3 rounded-md font-medium transition-colors duration-300 border ${isDark ? 'text-white hover:bg-white/5 border-white/20' : 'text-slate-800 hover:bg-slate-100 border-slate-300'}`}>
                      Create Account
                    </button>
                  </Link>
                </SignedOut>
              </div>
            </div>
          </GlassCard>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <div className="flex items-center">
            <div className={`h-8 w-8 rounded-full ${isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'} flex items-center justify-center mr-2`}>
              <Shield className={`h-4 w-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <span className={isDark ? 'text-white/80 text-sm' : 'text-slate-700 text-sm'}>Bank-level Security</span>
          </div>
          <div className="flex items-center">
            <div className={`h-8 w-8 rounded-full ${isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'} flex items-center justify-center mr-2`}>
              <div className={`text-xs font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>24/7</div>
            </div>
            <span className={isDark ? 'text-white/80 text-sm' : 'text-slate-700 text-sm'}>Customer Support</span>
          </div>
          <div className="flex items-center">
            <div className={`h-8 w-8 rounded-full ${isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'} flex items-center justify-center mr-2`}>
              <div className={`text-xs font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>100%</div>
            </div>
            <span className={isDark ? 'text-white/80 text-sm' : 'text-slate-700 text-sm'}>Private</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceHero; 