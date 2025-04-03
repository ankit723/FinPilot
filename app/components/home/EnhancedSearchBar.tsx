'use client';

import { useRouter } from 'next/navigation';
import { Search } from "lucide-react";
import { useState } from 'react';
import GlassCard from '../ui/glass-card';
import NeonText from '../ui/neon-text';
import NeoBorder from '../ui/neo-border';

const EnhancedSearchBar = () => {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = () => {
    router.push('/customize');
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8 px-4">
      <div className="mb-2 flex justify-center">
        <NeonText color="teal" size="xl" weight="semibold">
          Where would you like to explore?
        </NeonText>
      </div>
      
      <NeoBorder 
        color={isFocused ? "teal" : "white"} 
        variant={isFocused ? "solid" : "subtle"}
        className="transition-all duration-500"
      >
        <GlassCard 
          intensity="medium" 
          className="overflow-hidden"
        >
          <div 
            className="relative w-full cursor-pointer group"
            onClick={handleClick}
            onMouseEnter={() => setIsFocused(true)}
            onMouseLeave={() => setIsFocused(false)}
          >
            <input
              className="w-full h-16 pl-14 pr-4 text-lg bg-transparent text-white placeholder-white/70 focus:outline-none"
              placeholder="Search destinations, experiences, adventures..."
              readOnly
            />
            
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isFocused ? 'text-teal-400 scale-110' : 'text-white/70'}`}>
              <Search className="h-6 w-6" />
            </div>
            
            <div className={`absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </div>
        </GlassCard>
      </NeoBorder>
      
      <div className="mt-4 flex justify-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {['Beaches', 'Mountains', 'Cities', 'Historic', 'Adventure', 'Relaxation'].map((tag) => (
          <GlassCard key={tag} intensity="light" className="px-3 py-1 text-sm text-white/90 whitespace-nowrap hover:bg-white/20 cursor-pointer transition-all">
            {tag}
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default EnhancedSearchBar; 