'use client';

import { Check, MapPin, Calendar, Users, Bed, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepsProps {
  currentStep: 'search' | 'days' | 'travellers' | 'rooms' | 'confirmation';
}

const steps = [
  {
    id: 'search',
    name: 'Destination',
    icon: MapPin,
  },
  {
    id: 'days',
    name: 'Duration',
    icon: Calendar,
  },
  {
    id: 'travellers',
    name: 'Travelers',
    icon: Users,
  },
  {
    id: 'rooms',
    name: 'Rooms',
    icon: Bed,
  },
  {
    id: 'confirmation',
    name: 'Confirmation',
    icon: PartyPopper,
  },
] as const;

export default function Steps({ currentStep }: StepsProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const CurrentIcon = steps[currentStepIndex].icon;

  return (
    <div className="mb-8">
      <div className="hidden md:flex items-center justify-center gap-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center",
                  index <= currentStepIndex
                    ? "border-primary bg-primary text-white"
                    : "border-muted-foreground text-muted-foreground"
                )}
              >
                {index < currentStepIndex ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm mt-2",
                  index <= currentStepIndex
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-[2px] w-16 mx-2",
                  index < currentStepIndex
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile view */}
      <div className="flex md:hidden items-center justify-center">
        <div className="flex flex-col items-center">
          <div
            className="w-10 h-10 rounded-full border-2 border-primary bg-primary text-white flex items-center justify-center"
          >
            {currentStepIndex > 0 ? (
              <Check className="h-5 w-5" />
            ) : (
              <CurrentIcon className="h-5 w-5" />
            )}
          </div>
          <span className="text-sm mt-2 font-medium">
            Step {currentStepIndex + 1} of {steps.length}:
            <span className="ml-1 text-primary">
              {steps[currentStepIndex].name}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
} 