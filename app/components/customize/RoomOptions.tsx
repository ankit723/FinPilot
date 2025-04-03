'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Bed } from 'lucide-react';

interface RoomOptionsProps {
  onComplete: () => void;
}

interface RoomConfig {
  adults: number;
  children: number;
}

export default function RoomOptions({ onComplete }: RoomOptionsProps) {
  const [rooms, setRooms] = useState<RoomConfig[]>([
    { adults: 2, children: 0 }
  ]);

  const addRoom = () => {
    setRooms([...rooms, { adults: 1, children: 0 }]);
  };

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const updateRoom = (index: number, field: keyof RoomConfig, value: number) => {
    const newRooms = [...rooms];
    newRooms[index] = {
      ...newRooms[index],
      [field]: Math.max(field === 'adults' ? 1 : 0, value)
    };
    setRooms(newRooms);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">
        Configure Your Rooms
      </h2>

      <div className="space-y-4">
        {rooms.map((room, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5" />
                <h3 className="font-medium">Room {index + 1}</h3>
              </div>
              {rooms.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRoom(index)}
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Adults</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateRoom(index, 'adults', room.adults - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min={1}
                    value={room.adults}
                    onChange={(e) => updateRoom(index, 'adults', parseInt(e.target.value))}
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateRoom(index, 'adults', room.adults + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Children</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateRoom(index, 'children', room.children - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min={0}
                    value={room.children}
                    onChange={(e) => updateRoom(index, 'children', parseInt(e.target.value))}
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateRoom(index, 'children', room.children + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={addRoom}
        >
          Add Another Room
        </Button>
        <Button onClick={onComplete}>
          Continue
        </Button>
      </div>

      <p className="text-center text-muted-foreground">
        Configure rooms and occupancy for your stay
      </p>
    </div>
  );
} 