'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

interface Banner {
  img: string;
  alt: string;
}

const BannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('https://json-data-1wm2.onrender.com/banners');
        const data = await response.json();
        console.log(data);
        if (data.banners.length > 0) {
          setBanners(data.banners);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return <Skeleton className="w-full h-[600px]" />;
  }

  return (
    <Carousel className="w-full h-[600px]" opts={{ loop: true}}>
      <CarouselContent>
        {banners.map((banner) => (
          <CarouselItem key={banner.alt}>
            <div className="relative w-full h-[600px]">
              <Image
                src={banner.img}
                alt={banner.alt}
                fill
                className="object-cover"
                priority
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default BannerCarousel; 