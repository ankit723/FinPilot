'use client';

import { Card } from '@/components/ui/card';

interface DestinationDaysProps {
  destination: string;
  onSelect: (days: number) => void;
}

const DAYS_OPTIONS = [3, 5, 7, 10, 14];

export default function DestinationDays({ destination, onSelect }: DestinationDaysProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">
        How many days would you like to spend in {destination}?
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {DAYS_OPTIONS.map((days) => (
          <Card
            key={days}
            className="p-6 cursor-pointer hover:bg-primary/5 transition-colors"
            onClick={() => onSelect(days)}
          >
            <div className="text-center">
              <p className="text-3xl font-bold mb-2">{days}</p>
              <p className="text-muted-foreground">Days</p>
            </div>
          </Card>
        ))}
      </div>

      <p className="text-center text-muted-foreground">
        Choose the duration that best fits your travel plans
      </p>
    </div>
  );
} 