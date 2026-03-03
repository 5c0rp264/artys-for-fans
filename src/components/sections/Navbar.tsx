import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LOCALES = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const fansBtnRef = useRef<HTMLButtonElement>(null);
  const artistsBtnRef = useRef<HTMLButtonElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Toggle pill positioning
  useEffect(() => {
    const updatePill = () => {
      const btn = fansBtnRef.current;
      const pill = pillRef.current;
      if (!btn || !pill) return;
      const parent = btn.parentElement!;
      const parentRect = parent.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      pill.style.left = `${btnRect.left - parentRect.left + 3}px`;
      pill.style.top = '3px';
      pill.style.width = `${btnRect.width}px`;
      pill.style.height = `${btnRect.height}px`;
    };
    updatePill();
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, []);

  const handleArtistsClick = () => {
    window.open('https://artists.artysmusic.com', '_blank', 'noopener');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <a href="/" className="navbar-logo" aria-label="Artys Music">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#00e5b0" />
              <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
                fill="#000" fontFamily="Jost, sans-serif" fontWeight="900"
                fontSize="14" letterSpacing="1">A</text>
            </svg>
            <span className="navbar-logo-text">Artys</span>
          </a>

          {/* Toggle Fans / Artistes */}
          <div className="nav-toggle" role="group" aria-label="Mode">
            <div ref={pillRef} className="nav-toggle-pill" aria-hidden="true" />
            <button
              ref={fansBtnRef}
              className="nav-toggle-btn active"
              aria-pressed="true"
              aria-label="Landing fans"
            >
              {t('nav.toggle_fans')}
            </button>
            <button
              ref={artistsBtnRef}
              className="nav-toggle-btn inactive"
              aria-pressed="false"
              aria-label="Aller sur la landing artistes"
              onClick={handleArtistsClick}
            >
              {t('nav.toggle_artists')}
            </button>
          </div>

          {/* Desktop links */}
          <div className="nav-links">
            <button className="nav-link" onClick={() => scrollToSection('royaltips')} style={{ background: 'none', border: 'none' }}>
              {t('nav.backstage')}
            </button>
            <button className="nav-link" onClick={() => scrollToSection('comparison')} style={{ background: 'none', border: 'none' }}>
              {t('nav.revenus')}
            </button>
            <button className="nav-link" onClick={() => scrollToSection('governance')} style={{ background: 'none', border: 'none' }}>
              {t('nav.gouvernance')}
            </button>
          </div>

          {/* Right: Lang + Join + Hamburger */}
          <div className="nav-right">
            {/* Lang switcher */}
            <div className="lang-switcher" role="group" aria-label="Langue">
              {LOCALES.map(loc => (
                <button
                  key={loc.code}
                  className={`lang-btn ${i18n.language.startsWith(loc.code) ? 'active' : 'inactive'}`}
                  onClick={() => i18n.changeLanguage(loc.code)}
                  aria-label={`Langue : ${loc.label}`}
                  aria-pressed={i18n.language.startsWith(loc.code)}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            {/* CTA */}
            <button
              className="btn-primary"
              style={{ fontSize: 'clamp(0.62rem, 1.2vw, 0.78rem)', padding: '8px 18px', display: 'none' }}
              onClick={() => scrollToSection('cta')}
              aria-label="Rejoindre"
            >
              {t('nav.rejoindre')}
            </button>

            {/* Hamburger */}
            <button
              className={`hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <button className="mobile-nav-link" onClick={() => scrollToSection('royaltips')} style={{ background: 'none', border: 'none', textAlign: 'left', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          {t('nav.backstage')}
        </button>
        <button className="mobile-nav-link" onClick={() => scrollToSection('comparison')} style={{ background: 'none', border: 'none', textAlign: 'left', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          {t('nav.revenus')}
        </button>
        <button className="mobile-nav-link" onClick={() => scrollToSection('governance')} style={{ background: 'none', border: 'none', textAlign: 'left', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          {t('nav.gouvernance')}
        </button>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', paddingTop: '8px' }}>
          {LOCALES.map(loc => (
            <button
              key={loc.code}
              className={`lang-btn ${i18n.language.startsWith(loc.code) ? 'active' : 'inactive'}`}
              onClick={() => { i18n.changeLanguage(loc.code); setMenuOpen(false); }}
              aria-label={`Langue : ${loc.label}`}
            >
              {loc.label}
            </button>
          ))}
        </div>
        <button
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
          onClick={() => scrollToSection('cta')}
        >
          {t('nav.rejoindre')}
        </button>
      </div>
    </>
  );
}
