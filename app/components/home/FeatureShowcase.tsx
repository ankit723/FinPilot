'use client';

import GlassCard from '../ui/glass-card';
import { BadgeCheck, Shield, CreditCard, ArrowRightLeft, LineChart, Lock, PiggyBank, Wallet, AlertCircle, BarChart, Target, HeadphonesIcon } from 'lucide-react';
import { useState } from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="transition-transform duration-300 transform hover:-translate-y-1"
    >
      <GlassCard 
        intensity="light" 
        hoverEffect 
        className="h-full p-6 border-b-2 border-transparent hover:border-blue-500/50"
      >
        <div className="flex flex-col h-full">
          <div className="mb-4 p-3 rounded-full w-12 h-12 flex items-center justify-center bg-blue-500/10">
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-white/70 text-sm flex-grow">{description}</p>
        </div>
      </GlassCard>
    </div>
  );
};

const FeatureShowcase = () => {
  const features = [
    {
      icon: <PiggyBank className="w-5 h-5 text-blue-400" />,
      title: 'Budget Tracking',
      description: 'Create personalized budgets and track your expenses in real-time with smart categorization and customizable spending limits.'
    },
    {
      icon: <Wallet className="w-5 h-5 text-blue-400" />,
      title: 'Account Aggregation',
      description: 'Connect all your financial accounts in one place to get a complete picture of your finances and simplify your money management.'
    },
    {
      icon: <Shield className="w-5 h-5 text-blue-400" />,
      title: 'Secure Data Protection',
      description: 'Your financial data is protected with bank-level security and encryption, ensuring your sensitive information stays private.'
    },
    {
      icon: <BarChart className="w-5 h-5 text-blue-400" />,
      title: 'Financial Insights',
      description: 'Gain valuable insights into your spending patterns, income trends, and savings opportunities with AI-powered analytics.'
    },
    {
      icon: <Target className="w-5 h-5 text-blue-400" />,
      title: 'Goal Planning',
      description: 'Set and track financial goals like saving for a home, retirement, or education with personalized recommendations and progress tracking.'
    },
    {
      icon: <HeadphonesIcon className="w-5 h-5 text-blue-400" />,
      title: 'Premium Support',
      description: 'Access dedicated financial advisors through secure messaging or scheduled video calls to get expert advice on your financial decisions.'
    }
  ];

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Personal Finance Features
        </h2>
        <p className="text-white/80 max-w-3xl mx-auto">
          A comprehensive suite of tools designed to simplify and optimize your financial management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureShowcase; 