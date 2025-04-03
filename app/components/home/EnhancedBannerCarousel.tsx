'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import GlassCard from '../ui/glass-card';
import NeonText from '../ui/neon-text';
import NeoBorder from '../ui/neo-border';

interface Banner {
  img: string;
  alt: string;
  title?: string;
  description?: string;
}

const EnhancedBannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('https://json-data-1wm2.onrender.com/banners');
        const data = await response.json();
        
        if (data.banners.length > 0) {
          // Enhance the data with titles and descriptions if they don't exist
          const enhancedBanners = data.banners.map((banner: Banner, index: number) => ({
            ...banner,
            title: banner.title || `Discover Amazing Destinations ${index + 1}`,
            description: banner.description || 'Experience unforgettable adventures and create lasting memories with our exclusive travel packages.'
          }));
          setBanners(enhancedBanners);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        // Fallback data in case API fails
        setBanners([
          {
            img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
            alt: 'Beautiful mountain landscape',
            title: 'Explore Amazing Destinations',
            description: 'Discover breathtaking views and unforgettable experiences'
          },
          {
            img: 'https://images.unsplash.com/photo-1520454974749-611b7248ffdb',
            alt: 'Tropical beach paradise',
            title: 'Relax in Paradise',
            description: 'Unwind on pristine beaches with crystal clear waters'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (!api) return;
    
    api.on('select', () => {
      setActiveIndex(api.selectedScrollSnap());
    });
  }, [api]);

  if (loading) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      <Carousel 
        className="w-full h-full" 
        opts={{ loop: true }}
        setApi={setApi}
      >
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem key={banner.alt}>
              <div className="relative w-full h-[600px] group">
                {/* Image with overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 z-10" />
                
                <Image
                  src={banner.img}
                  alt={banner.alt}
                  fill
                  className="object-cover transition-transform duration-10000 group-hover:scale-110"
                  priority
                />
                
                {/* Glass card with content */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10">
                  <GlassCard 
                    intensity="light" 
                    hoverEffect
                    className="p-6 md:p-8 max-w-3xl mx-auto overflow-hidden"
                  >
                    <NeoBorder 
                      color="white" 
                      variant="subtle"
                      className="max-w-fit mb-4"
                    >
                      <NeonText 
                        color="white" 
                        size="3xl" 
                        weight="bold"
                        className="block mb-2"
                      >
                        {banner.title}
                      </NeonText>
                    </NeoBorder>
                    
                    <p className="text-white/90 text-lg mb-6">
                      {banner.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mt-4">
                      <button className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-md transition-all transform hover:scale-105 hover:shadow-[0_0_15px_rgba(20,184,166,0.5)]">
                        Explore Now
                      </button>
                      <button className="px-6 py-2 bg-transparent border border-white/50 hover:border-white/90 text-white rounded-md transition-all transform hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        Learn More
                      </button>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Custom navigation */}
        <div className="absolute bottom-5 right-5 z-30 flex items-center gap-2">
          <CarouselPrevious className="h-9 w-9 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20" />
          <CarouselNext className="h-9 w-9 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20" />
        </div>
        
        {/* Pagination indicators */}
        <div className="absolute bottom-5 left-0 right-0 z-30 flex justify-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                activeIndex === index 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              onClick={() => api.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default EnhancedBannerCarousel; 