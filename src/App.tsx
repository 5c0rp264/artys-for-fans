import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/sections/Navbar';
import HeroSection from './components/sections/HeroSection';
import RoyaltipsSection from './components/sections/RoyaltipsSection';
import ProblemSection from './components/sections/ProblemSection';
import ComparisonSection from './components/sections/ComparisonSection';
import GovernanceSection from './components/sections/GovernanceSection';
import CTASection from './components/sections/CTASection';
import Footer from './components/sections/Footer';
import CursorGlow from './components/effects/CursorGlow';

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const appRef = useRef<HTMLDivElement>(null);

  // Scroll top button visibility
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={appRef} className="app">
      {/* Visual effects */}
      <div className="grain-overlay" aria-hidden="true" />
      <CursorGlow />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main id="main-content" role="main">
        <HeroSection />

        <div className="section-divider" aria-hidden="true" />
        <RoyaltipsSection />

        <div className="section-divider" aria-hidden="true" />
        <ProblemSection />

        <div className="section-divider" aria-hidden="true" />
        <ComparisonSection />

        <div className="section-divider" aria-hidden="true" />
        <GovernanceSection />

        <div className="section-divider" aria-hidden="true" />
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to top */}
      <button
        className={`scroll-top${showScrollTop ? ' visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Retour en haut"
        title="Retour en haut"
      >
        ↑
      </button>
    </div>
  );
}
