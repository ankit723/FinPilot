'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface ProfessionalTextProps {
  children: ReactNode;
  color?: 'blue' | 'purple' | 'green' | 'pink' | 'teal' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

const ProfessionalText = ({
  children,
  color = 'blue',
  size = 'lg',
  weight = 'semibold',
  className,
}: ProfessionalTextProps) => {
  const { theme } = useTheme();
  const isDark = theme !== 'light';

  // Light theme colors
  const lightColorMap = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    pink: 'text-pink-600',
    teal: 'text-teal-600',
    white: 'text-slate-900', // Use dark text for light theme
  };

  // Dark theme colors
  const darkColorMap = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    pink: 'text-pink-400',
    teal: 'text-teal-400',
    white: 'text-white',
  };

  const colorMap = isDark ? darkColorMap : lightColorMap;

  const sizeMap = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  };

  const weightMap = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <span
      className={cn(
        'tracking-wide',
        colorMap[color],
        sizeMap[size],
        weightMap[weight],
        className
      )}
    >
      {children}
    </span>
  );
};

export default ProfessionalText; 