import GradientBackground from '@/app/components/ui/gradient-background';
import FinanceHero from './components/home/FinanceHero';
import FeatureShowcase from '@/app/components/home/FeatureShowcase';
import GlassFooter from '@/app/components/ui/glass-footer';
import FinanceStats from './components/home/FinanceStats';
import FinanceTestimonials from './components/home/FinanceTestimonials';
import FinanceCTA from './components/home/FinanceCTA';

export default function HomePage() {
  return (
    <GradientBackground variant="navy" animated>
      <main className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <FinanceHero />
        
        {/* Feature Showcase */}
        <section className="mb-8">
          <FeatureShowcase />
        </section>
        
        {/* Stats */}
        <section>
          <FinanceStats />
        </section>
        
        {/* Testimonials */}
        <section>
          <FinanceTestimonials />
        </section>
        
        {/* Call to Action */}
        <section>
          <FinanceCTA />
        </section>
        
        {/* Footer */}
        <GlassFooter />
      </main>
    </GradientBackground>
  );
}
