'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface GradientBackgroundProps {
  children: ReactNode;
  variant?: 'blue' | 'navy' | 'slate' | 'gray' | 'teal';
  animated?: boolean;
  className?: string;
}

const GradientBackground = ({
  children,
  variant = 'navy',
  animated = false,
  className,
}: GradientBackgroundProps) => {
  const { theme } = useTheme();
  const isDark = theme !== 'light';

  // Dark theme gradients
  const darkGradients = {
    'blue': 'bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950',
    'navy': 'bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950',
    'slate': 'bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900',
    'gray': 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
    'teal': 'bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900',
  };

  // Light theme gradients
  const lightGradients = {
    'blue': 'bg-gradient-to-br from-blue-50 via-blue-100 to-sky-100',
    'navy': 'bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100',
    'slate': 'bg-gradient-to-br from-gray-100 via-slate-50 to-gray-100',
    'gray': 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100',
    'teal': 'bg-gradient-to-br from-teal-50 via-slate-100 to-teal-100',
  };

  const gradientVariants = isDark ? darkGradients : lightGradients;

  const animationClass = animated
    ? 'animate-gradient-animation bg-[length:200%_200%]'
    : '';

  return (
    <div className={cn(
      'relative min-h-screen w-full overflow-hidden',
      gradientVariants[variant],
      animationClass,
      className
    )}>
      <div className={cn(
        'absolute inset-0 bg-grid-pattern -z-10',
        isDark ? 'bg-grid-white/[0.01]' : 'bg-grid-dark/[0.02]'
      )} />
      {children}
    </div>
  );
};

export default GradientBackground; 