'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Wifi, Coffee, Utensils, Car, Hotel } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Trip {
  id: number;
  name: string;
  price: number;
  duration: number;
  amenities: string[];
  image: string;
}

interface TripCardProps {
  trip: Trip;
}

const amenityIcons: Record<string, LucideIcon> = {
  'wifi': Wifi,
  'food': Utensils,
  'coffee': Coffee,
  'transport': Car,
  'accommodation': Hotel,
  '5-star hotel accommodation': Hotel,
  'luxury accommodation': Hotel,
  'private guided tours': Car,
  'airport transfers': Car,
  'daily breakfast': Coffee,
  'all meals included': Utensils,
  'nile cruise': Car,
  'desert safari': Car,
  'internal flights': Car,
};

export default function TripCard({ trip }: TripCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-muted">
        <Image
          src={trip.image}
          alt={trip.name}
          fill
          className="object-cover transition-opacity duration-300"
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader>
        <CardTitle>{trip.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{trip.duration} days</span>
          </div>
          <p className="font-bold text-lg">
            ${trip.price.toLocaleString()}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {trip.amenities.map((amenity) => {
            const Icon = amenityIcons[amenity.toLowerCase()] || Coffee;
            return (
              <div
                key={amenity}
                className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-2 py-1 rounded-md"
              >
                <Icon className="h-4 w-4" />
                <span>{amenity}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
} 