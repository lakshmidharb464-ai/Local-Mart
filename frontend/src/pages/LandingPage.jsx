import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { ServicesSection } from '../components/ServicesSection';
import { ProductCatalog } from '../components/ProductCatalog';
import { FeaturesSection } from '../components/FeaturesSection';
import { ContactSection } from '../components/ContactSection';

export const LandingPage = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProductCatalog />
      <FeaturesSection />
      <ContactSection />
    </div>
  );
};

export default LandingPage;

