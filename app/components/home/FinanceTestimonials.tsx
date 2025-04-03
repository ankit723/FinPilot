'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import GlassCard from '../ui/glass-card';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  content: string;
  author: string;
  position: string;
  company: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    content: "Since using FinePilot, I've saved countless hours managing my finances. The budgeting tools and spending insights have completely transformed how I handle my money.",
    author: "Sarah Johnson",
    position: "Marketing Executive",
    company: "Innovatech Solutions",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    content: "The goal tracking feature helped me save for my dream home. I was able to visualize my progress and stay motivated. Within 18 months, I had my down payment ready!",
    author: "Michael Chen",
    position: "Software Engineer",
    company: "Horizon Tech",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    content: "Their mobile app is exceptional. I can track all my expenses on the go, and the real-time notifications keep me informed about unusual spending patterns.",
    author: "Emily Rodriguez",
    position: "Freelance Designer",
    company: "Pulse Media",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    content: "As a financial advisor, I recommend FinePilot to all my clients. The comprehensive features, easy account aggregation, and insightful reports make financial planning simple.",
    author: "David Thompson",
    position: "Financial Advisor",
    company: "Wealth Partners",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg"
  }
];

const FinanceTestimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  useEffect(() => {
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Hear from people who have transformed their financial lives with FinePilot
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <GlassCard intensity="light" className="p-8 md:p-12 relative">
            {/* Large quote icon */}
            <div className="absolute top-8 right-8 opacity-10">
              <Quote size={80} className="text-blue-400" />
            </div>

            <div className="relative z-10">
              <div className="min-h-[150px] md:min-h-[120px]">
                <div
                  className={`transition-opacity duration-500 ${
                    isAnimating ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <p className="italic text-lg mb-6 md:text-xl text-white/90">
                    &ldquo;{testimonials[activeIndex].content}&rdquo;
                  </p>
                </div>
              </div>

              <div 
                className={`flex items-center mt-6 transition-opacity duration-500 ${
                  isAnimating ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <div className="relative h-14 w-14 rounded-full overflow-hidden border border-white/20">
                  <Image
                    src={testimonials[activeIndex].avatar}
                    alt={testimonials[activeIndex].author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-white font-semibold">{testimonials[activeIndex].author}</h4>
                  <p className="text-white/70 text-sm">
                    {testimonials[activeIndex].position}, {testimonials[activeIndex].company}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Navigation controls */}
          <div className="flex justify-center mt-8 space-x-4">
            <button 
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-blue-500/20 hover:bg-blue-500/30 flex items-center justify-center transition-colors"
              disabled={isAnimating}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (isAnimating) return;
                    setIsAnimating(true);
                    setActiveIndex(index);
                    setTimeout(() => setIsAnimating(false), 500);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeIndex === index
                      ? 'bg-blue-400 w-6'
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-blue-500/20 hover:bg-blue-500/30 flex items-center justify-center transition-colors"
              disabled={isAnimating}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceTestimonials; 