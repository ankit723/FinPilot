'use client';

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";


const ExpertButton = () => {
    'use client';
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <Button
              size="lg"
              className="shadow-lg"
              onClick={() => window.location.href = '/get-in-touch'}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Talk to an Expert
            </Button>
          </div>
    );
  };

export default ExpertButton