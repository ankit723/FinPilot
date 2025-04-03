'use client';

import { Card } from '@/components/ui/card';
import { Users, User, Users2, Heart } from 'lucide-react';

interface TravellerFormProps {
  onSelect: (type: string) => void;
}

const TRAVELLER_TYPES = [
  {
    id: 'solo',
    label: 'Solo',
    icon: User,
    description: 'Traveling alone'
  },
  {
    id: 'couple',
    label: 'Couple',
    icon: Heart,
    description: 'Romantic getaway'
  },
  {
    id: 'family',
    label: 'Family',
    icon: Users,
    description: 'With kids'
  },
  {
    id: 'group',
    label: 'Group',
    icon: Users2,
    description: 'Friends or colleagues'
  }
];

export default function TravellerForm({ onSelect }: TravellerFormProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">
        Who is traveling with you?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TRAVELLER_TYPES.map(({ id, label, icon: Icon, description }) => (
          <Card
            key={id}
            className="p-6 cursor-pointer hover:bg-primary/5 transition-colors"
            onClick={() => onSelect(id)}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{label}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <p className="text-center text-muted-foreground">
        Select who you&apos;ll be traveling with to help us customize your experience
      </p>
    </div>
  );
} 