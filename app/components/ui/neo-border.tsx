'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface ProfessionalBorderProps {
  children: ReactNode;
  color?: 'blue' | 'purple' | 'green' | 'pink' | 'teal' | 'white';
  variant?: 'subtle' | 'solid';
  className?: string;
}

const ProfessionalBorder = ({
  children,
  color = 'blue',
  variant = 'solid',
  className,
}: ProfessionalBorderProps) => {
  const { theme } = useTheme();
  const isDark = theme !== 'light';

  // Dark theme colors
  const darkColorMap = {
    blue: {
      solid: 'border-blue-500',
      subtle: 'border-blue-500/40',
    },
    purple: {
      solid: 'border-purple-500',
      subtle: 'border-purple-500/40',
    },
    green: {
      solid: 'border-green-500',
      subtle: 'border-green-500/40',
    },
    pink: {
      solid: 'border-pink-500',
      subtle: 'border-pink-500/40',
    },
    teal: {
      solid: 'border-teal-500',
      subtle: 'border-teal-500/40',
    },
    white: {
      solid: 'border-white',
      subtle: 'border-white/40',
    },
  };

  // Light theme colors
  const lightColorMap = {
    blue: {
      solid: 'border-blue-600',
      subtle: 'border-blue-600/40',
    },
    purple: {
      solid: 'border-purple-600',
      subtle: 'border-purple-600/40',
    },
    green: {
      solid: 'border-green-600',
      subtle: 'border-green-600/40',
    },
    pink: {
      solid: 'border-pink-600',
      subtle: 'border-pink-600/40',
    },
    teal: {
      solid: 'border-teal-600',
      subtle: 'border-teal-600/40',
    },
    white: {
      solid: 'border-slate-300',
      subtle: 'border-slate-300/40',
    },
  };

  const colorMap = isDark ? darkColorMap : lightColorMap;

  return (
    <div
      className={cn(
        'relative border rounded-xl overflow-hidden transition-all duration-300',
        colorMap[color][variant],
        className
      )}
    >
      {children}
    </div>
  );
};

export default ProfessionalBorder; 