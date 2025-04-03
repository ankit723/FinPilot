'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';

const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme || 'system';

  const toggleOpen = () => setIsOpen(!isOpen);

  const getThemeIcon = (themeName: string) => {
    switch (themeName) {
      case 'dark':
        return <Moon className="h-5 w-5" />;
      case 'light':
        return <Sun className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleOpen}
        className="relative h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center transform transition-all hover:scale-110 hover:bg-blue-500/30"
        aria-label="Toggle theme"
      >
        {getThemeIcon(currentTheme)}
        <span className="absolute inset-0 rounded-full border border-white/20 animate-pulse"></span>
      </button>

    </div>
  );
};

export default ThemeToggle; 