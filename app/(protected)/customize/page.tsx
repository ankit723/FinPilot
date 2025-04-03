'use client';

import { useState } from 'react';
import CustomizeSearch from '../../components/customize/CustomizeSearch';
import TravellerForm from '../../components/customize/TravellerForm';
import RoomOptions from '../../components/customize/RoomOptions';
import DestinationDays from '../../components/customize/DestinationDays';
import Steps from '../../components/customize/Steps';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type Step = 'search' | 'days' | 'travellers' | 'rooms' | 'confirmation';

export default function CustomizePage() {
  const [step, setStep] = useState<Step>('search');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [days, setDays] = useState(0);
  const [travellerType, setTravellerType] = useState('');

  const handleDestinationSelect = (destination: string) => {
    setSelectedDestination(destination);
    setStep('days');
  };

  const handleDaysSelect = (numberOfDays: number) => {
    setDays(numberOfDays);
    setStep('travellers');
  };

  const handleTravellerSelect = (type: string) => {
    setTravellerType(type);
    setStep('rooms');
  };

  const handleRoomSelect = () => {
    setStep('confirmation');
  };

  const handleBack = () => {
    switch (step) {
      case 'days':
        setStep('search');
        break;
      case 'travellers':
        setStep('days');
        break;
      case 'rooms':
        setStep('travellers');
        break;
      case 'confirmation':
        setStep('rooms');
        break;
    }
  };

  return (
    <main className="min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          {step !== 'search' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-4xl font-bold text-center flex-1">
            Customize Your Perfect Trip
          </h1>
          {step !== 'search' && <div className="w-9" />} {/* Spacer for alignment */}
        </div>

        <Steps currentStep={step} />

        {step === 'search' && (
          <CustomizeSearch onSelect={handleDestinationSelect} />
        )}

        {step === 'days' && (
          <DestinationDays
            destination={selectedDestination}
            onSelect={handleDaysSelect}
          />
        )}

        {step === 'travellers' && (
          <TravellerForm onSelect={handleTravellerSelect} />
        )}

        {step === 'rooms' && (
          <RoomOptions onComplete={handleRoomSelect} />
        )}

        {step === 'confirmation' && (
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Congratulations! 🎉</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Your perfect trip to {selectedDestination} has been customized.
              Our travel experts will be in touch with you shortly.
            </p>
            <p className="text-muted-foreground">
              Trip Summary:
              <br />
              Destination: {selectedDestination}
              <br />
              Duration: {days} days
              <br />
              Travel Type: {travellerType}
            </p>
          </Card>
        )}
      </div>
    </main>
  );
} 