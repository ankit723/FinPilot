'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';

const DESTINATIONS = [
  'Maldives', 'Egypt', 'Bali', 'Dubai', 'Japan',
  'Australia', 'Thailand', 'Singapore', 'Vietnam',
  'South Korea', 'Malaysia', 'Indonesia'
];

interface CustomizeSearchProps {
  onSelect: (destination: string) => void;
}

export default function CustomizeSearch({ onSelect }: CustomizeSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDestinations, setFilteredDestinations] = useState(DESTINATIONS);

  useEffect(() => {
    const filtered = DESTINATIONS.filter(destination =>
      destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDestinations(filtered);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          className="w-full h-14 pl-12 pr-4 text-lg"
          placeholder="Pick your destination"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDestinations.map((destination) => (
          <Card
            key={destination}
            className="p-4 cursor-pointer hover:bg-primary/5 transition-colors"
            onClick={() => onSelect(destination)}
          >
            <p className="text-lg font-medium text-center">{destination}</p>
          </Card>
        ))}
      </div>
    </div>
  );
} 