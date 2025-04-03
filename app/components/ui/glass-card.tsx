'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  intensity?: 'light' | 'medium' | 'heavy';
  hoverEffect?: boolean;
  className?: string;
}

const GlassCard = ({
  children,
  intensity = 'medium',
  hoverEffect = false,
  className,
  ...props
}: GlassCardProps) => {
  const { theme } = useTheme();
  const isDark = theme !== 'light';

  // Dark theme glass styles
  const darkGlassStyles = {
    light: 'bg-white/5 backdrop-blur-sm',
    medium: 'bg-white/10 backdrop-blur-md',
    heavy: 'bg-white/15 backdrop-blur-lg',
  };

  // Light theme glass styles
  const lightGlassStyles = {
    light: 'bg-slate-900/5 backdrop-blur-sm',
    medium: 'bg-slate-900/10 backdrop-blur-md',
    heavy: 'bg-slate-900/15 backdrop-blur-lg',
  };

  const glassStyles = isDark ? darkGlassStyles : lightGlassStyles;

  // Hover effects based on theme
  const darkHoverStyles = hoverEffect 
    ? 'transition-all duration-300 hover:bg-white/15' 
    : '';
  
  const lightHoverStyles = hoverEffect
    ? 'transition-all duration-300 hover:bg-slate-900/15'
    : '';

  const hoverStyles = isDark ? darkHoverStyles : lightHoverStyles;

  // Text colors based on theme
  const textColorClass = isDark ? 'text-white' : 'text-slate-900';

  return (
    <div
      className={cn(
        'rounded-lg shadow-sm',
        glassStyles[intensity],
        hoverStyles,
        textColorClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard; 