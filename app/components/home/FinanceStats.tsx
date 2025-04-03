'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import GlassCard from '../ui/glass-card';
import { useTheme } from 'next-themes';

interface StatItemProps {
  value: string;
  label: string;
  delay: number;
}

const StatItem = ({ value, label, delay }: StatItemProps) => {
  const [count, setCount] = useState(0);
  const finalValue = parseInt(value.replace(/\D/g, ''));
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  const { theme } = useTheme();
  const isDark = theme !== 'light';

  useEffect(() => {
    if (inView) {
      const duration = 2000; // 2 seconds
      const startTime = Date.now();
      
      const timer = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        setCount(Math.floor(progress * finalValue));
        
        if (progress === 1) {
          clearInterval(timer);
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [inView, finalValue]);

  return (
    <div 
      ref={ref}
      className={`transition-all duration-700 ease-out transform ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <GlassCard 
        intensity="light" 
        className="p-8 text-center"
      >
        <div className={`text-3xl font-bold mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
          {value.includes('+') 
            ? `${count}+` 
            : value.includes('$') 
              ? `$${count}M` 
              : `${count}`}
        </div>
        <p className={`font-medium ${isDark ? 'text-white/80' : 'text-slate-700'}`}>{label}</p>
      </GlassCard>
    </div>
  );
};

const FinanceStats = () => {
  const { theme } = useTheme();
  const isDark = theme !== 'light';
  
  return (
    <div className={`py-16 ${isDark ? 'bg-slate-900/30' : 'bg-slate-100/50'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            FinePilot by the Numbers
          </h2>
          <p className={isDark ? 'text-white/80 max-w-2xl mx-auto' : 'text-slate-700 max-w-2xl mx-auto'}>
            See why thousands trust us with their personal finance management needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatItem value="$5.2B+" label="Finances Managed" delay={0} />
          <StatItem value="94%" label="User Satisfaction" delay={200} />
          <StatItem value="45%" label="Avg. Savings Growth" delay={400} />
          <StatItem value="15min" label="Daily Time Saved" delay={600} />
        </div>
      </div>
    </div>
  );
};

export default FinanceStats; 