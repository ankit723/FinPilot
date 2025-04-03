'use client';

import { useState, useEffect } from 'react';
import NeonText from '../ui/neon-text';
import NeoBorder from '../ui/neo-border';
import GlassCard from '../ui/glass-card';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/30 rounded-full filter blur-3xl animate-float opacity-50" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl animate-float opacity-30" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-teal-600/20 rounded-full filter blur-3xl animate-float opacity-40" style={{ animationDelay: '1s' }} />
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />

      {/* Content */}
      <div 
        className={`relative z-10 max-w-5xl mx-auto transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}
      >
        <NeoBorder 
          color="purple" 
          variant="solid"
          className="mx-auto mb-6 max-w-fit"
        >
          <NeonText 
            color="purple" 
            size="4xl" 
            weight="bold"
            className="block font-bold tracking-tight md:text-5xl lg:text-6xl"
          >
            Discover the World
          </NeonText>
        </NeoBorder>
        
        <div 
          className={`mt-4 transition-all duration-1000 delay-300 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
        >
          <GlassCard intensity="light" className="px-6 py-4 mb-8 max-w-2xl mx-auto">
            <p className="text-white/90 text-lg md:text-xl leading-relaxed">
              Embark on unforgettable journeys to breathtaking destinations. 
              Create memories that last a lifetime with our exclusive travel experiences.
            </p>
          </GlassCard>
        </div>
        
        {/* Stats with glass morphism effect */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 transition-all duration-1000 delay-500 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
        >
          {[
            { label: 'Destinations', value: '200+' },
            { label: 'Experiences', value: '150+' },
            { label: 'Happy Travelers', value: '25K+' },
            { label: 'Awards', value: '15+' }
          ].map((stat, index) => (
            <GlassCard 
              key={stat.label} 
              intensity="medium" 
              hoverEffect 
              className="px-4 py-5"
            >
              <div className="text-center">
                <NeonText 
                  color={['teal', 'blue', 'purple', 'pink'][index % 4] as any} 
                  size="2xl"
                  className="font-bold"
                >
                  {stat.value}
                </NeonText>
                <p className="text-white/70 mt-1">{stat.label}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 