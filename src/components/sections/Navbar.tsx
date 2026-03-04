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
            <img
              src="/artys-logo.png"
              alt="Artys Music"
              className="navbar-logo-img"
            />
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

            {/* CTA desktop — visible */}
            <button
              className="btn-primary nav-cta-btn"
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

        {/* Toggle Fans / Artists en haut du menu mobile */}
        <div className="mobile-toggle-wrap">
          <div className="nav-toggle nav-toggle-mobile" role="group" aria-label="Mode">
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
              className="nav-toggle-btn inactive"
              aria-pressed="false"
              aria-label="Aller sur la landing artistes"
              onClick={handleArtistsClick}
            >
              {t('nav.toggle_artists')}
            </button>
          </div>
        </div>

        <button className="mobile-nav-link" onClick={() => scrollToSection('backstage')} style={{ background: 'none', border: 'none', textAlign: 'left', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          {t('nav.backstage')}
        </button>
        <button className="mobile-nav-link" onClick={() => scrollToSection('echo')} style={{ background: 'none', border: 'none', textAlign: 'left', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          ECHO
        </button>
        <button className="mobile-nav-link" onClick={() => scrollToSection('fair')} style={{ background: 'none', border: 'none', textAlign: 'left', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
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
