import React, { useEffect } from 'react';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { ServicesSection } from '../components/ServicesSection';
import { ProductCatalog } from '../components/ProductCatalog';
import { FeaturesSection } from '../components/FeaturesSection';
import { ContactSection } from '../components/ContactSection';

export const LandingPage = () => {
  // Handle direct hash navigation or reset scroll on mount
  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <>
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold shadow-lg"
      >
        Skip to main content
      </a>

      <main id="main-content" aria-label="LocalFarm Direct Marketplace" className="space-y-0">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProductCatalog />
        <FeaturesSection />
        <ContactSection />
      </main>
    </>
  );
};

export default LandingPage;


