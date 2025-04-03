'use client';

import { Card } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import ContactForm from '../../components/contact/ContactForm';

export default function GetInTouchPage() {

  return (
    <main className="min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Get in Touch</h1>
        </div>
        
        <Card className="p-6">
          <p className="text-lg text-muted-foreground mb-8">
            Have questions about your trip? Our travel experts are here to help you plan your perfect vacation.
          </p>

          <ContactForm />
        </Card>
      </div>
    </main>
  );
} 