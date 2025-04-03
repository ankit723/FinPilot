'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import GlassCard from '../ui/glass-card';
import NeonText from '../ui/neon-text';

interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  rating: number;
  category: string;
}

const PopularDestinationsGrid = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    // Simulated data - in a real app, fetch from API
    const mockDestinations: Destination[] = [
      {
        id: '1',
        name: 'Santorini, Greece',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d3633b7f',
        description: 'Experience stunning sunsets and white-washed buildings on this beautiful Greek island.',
        price: 1299,
        rating: 4.8,
        category: 'beaches'
      },
      {
        id: '2',
        name: 'Kyoto, Japan',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e',
        description: 'Explore ancient temples and beautiful gardens in Japan&apos;s cultural capital.',
        price: 1599,
        rating: 4.9,
        category: 'cultural'
      },
      {
        id: '3',
        name: 'Bali, Indonesia',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
        description: 'Discover tropical paradise with lush landscapes and vibrant culture.',
        price: 1099,
        rating: 4.7,
        category: 'beaches'
      },
      {
        id: '4',
        name: 'Swiss Alps',
        image: 'https://images.unsplash.com/photo-1531890871850-2e8d81335a68',
        description: 'Experience breathtaking mountain views and world-class skiing.',
        price: 1899,
        rating: 4.9,
        category: 'mountains'
      },
      {
        id: '5',
        name: 'Barcelona, Spain',
        image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded',
        description: 'Enjoy stunning architecture, delicious cuisine, and vibrant nightlife.',
        price: 999,
        rating: 4.6,
        category: 'cities'
      },
      {
        id: '6',
        name: 'Machu Picchu, Peru',
        image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377',
        description: 'Explore the ancient Incan citadel set against breathtaking mountain scenery.',
        price: 1799,
        rating: 4.9,
        category: 'historic'
      }
    ];
    
    setDestinations(mockDestinations);
    setLoading(false);
  }, []);

  return (
    <div className="py-16 px-4 relative">
      <div className="text-center mb-12">
        <NeonText color="purple" size="3xl" className="mb-3">
          Popular Destinations
        </NeonText>
        <p className="text-white/80 max-w-2xl mx-auto">
          Discover our most loved travel destinations, each offering unique experiences and unforgettable memories
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-white/5 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <Link 
              href={`/destination/${destination.id}`} 
              key={destination.id}
              className="block transform transition-all duration-300 hover:-translate-y-2"
              onMouseEnter={() => setHoveredCard(destination.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <GlassCard 
                intensity="medium" 
                hoverEffect 
                className="h-full overflow-hidden"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover transition-transform duration-3000 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 z-10">
                    <div className="flex items-center bg-white/10 backdrop-blur-md rounded-lg px-2 py-1">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-white text-sm">{destination.rating}</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-purple-500/80 backdrop-blur-md rounded-full px-3 py-1">
                      <span className="text-white text-xs uppercase tracking-wider">
                        {destination.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-white text-xl font-semibold mb-2">{destination.name}</h3>
                  <p className="text-white/70 text-sm mb-4">{destination.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <span className="text-purple-400 font-bold text-xl">${destination.price}</span>
                      <span className="text-white/60 text-sm ml-1">per person</span>
                    </div>
                    
                    <button className="text-white text-sm bg-purple-600/80 hover:bg-purple-600 px-3 py-1 rounded-md transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
      
      <div className="text-center mt-12">
        <Link 
          href="/customize" 
          className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg transform transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]"
        >
          Explore All Destinations
        </Link>
      </div>
    </div>
  );
};

export default PopularDestinationsGrid; 