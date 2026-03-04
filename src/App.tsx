import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/sections/Navbar';
import HeroSection from './components/sections/HeroSection';
import ProblemSection from './components/sections/ProblemSection';
import EchoSection from './components/sections/EchoSection';
import BackstageSection from './components/sections/BackstageSection';
import ReferralSection from './components/sections/ReferralSection';
import FairSection from './components/sections/FairSection';
import SocialProofSection from './components/sections/SocialProofSection';
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

      {/* Main content — ordre exact du brief */}
      <main id="main-content" role="main">

        {/* 0 — Hero */}
        <HeroSection />

        {/* 1 — Le problème */}
        <div className="section-divider" aria-hidden="true" />
        <ProblemSection />

        {/* 2 — ECHO */}
        <div className="section-divider" aria-hidden="true" />
        <EchoSection />

        {/* 3 — Backstage Guilds */}
        <div className="section-divider" aria-hidden="true" />
        <BackstageSection />

        {/* 4 — Parrainage */}
        <div className="section-divider" aria-hidden="true" />
        <ReferralSection />

        {/* 5 — Streaming équitable */}
        <div className="section-divider" aria-hidden="true" />
        <FairSection />

        {/* 6 — Preuve sociale */}
        <div className="section-divider" aria-hidden="true" />
        <SocialProofSection />

        {/* 7 — Gouvernance */}
        <div className="section-divider" aria-hidden="true" />
        <GovernanceSection />

        {/* 8 — Waiting List / CTA */}
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
