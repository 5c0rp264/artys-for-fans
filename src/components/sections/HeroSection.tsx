import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const underlinePath = useRef<SVGPathElement>(null);

  useGSAP(() => {
    // Badge
    gsap.fromTo(badgeRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 }
    );

    // Title words animation
    const words = titleRef.current?.querySelectorAll('.word');
    if (words && words.length > 0) {
      gsap.fromTo(words,
        { opacity: 0, y: 60, rotateX: -20 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.08,
          delay: 0.2,
        }
      );
    }

    // Underline SVG
    if (underlinePath.current) {
      gsap.fromTo(underlinePath.current,
        { strokeDashoffset: 400 },
        { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut', delay: 1.35 }
      );
    }

    // Subtitle
    gsap.to(subtitleRef.current, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.9
    });

    // CTAs
    gsap.to(ctasRef.current, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 1.1
    });

    // Stats
    gsap.to(statsRef.current, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 1.3
    });

  }, { scope: containerRef });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Split title into words for animation
  const titleWords = [
    { text: t('hero.title_1'), isHighlight: false, breakAfter: false },
    { text: t('hero.title_2'), isHighlight: false, breakAfter: false },
    { text: t('hero.title_highlight'), isHighlight: true, breakAfter: true },
    { text: t('hero.title_3'), isHighlight: false, breakAfter: false },
  ];

  return (
    <section className="hero" ref={containerRef} id="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="container">
        <div className="hero-content">

          {/* Badge */}
          <div ref={badgeRef} className="section-badge" aria-label="Catégorie">
            <span>✦</span>
            {t('hero.badge')}
          </div>

          {/* Title */}
          <div ref={titleRef} className="hero-title" aria-label={`${t('hero.title_1')} ${t('hero.title_2')} ${t('hero.title_highlight')} ${t('hero.title_3')}`}>
            {titleWords.map((item, i) => (
              item.isHighlight ? (
                <span key={i} className="word hero-underline-wrap" style={{ color: 'var(--accent)' }}>
                  {item.text}
                  <svg className="hero-underline-svg" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true">
                    <path
                      ref={underlinePath}
                      d="M4 8 Q75 2 150 6 Q225 10 296 4"
                      strokeDasharray="400"
                      strokeDashoffset="400"
                    />
                  </svg>
                  {item.breakAfter && <br />}
                  {' '}
                </span>
              ) : (
                <span key={i} className="word">
                  {item.text}{item.breakAfter && <br />}
                  {' '}
                </span>
              )
            ))}
          </div>

          {/* Subtitle */}
          <p ref={subtitleRef} className="hero-subtitle">
            {t('hero.subtitle')}
          </p>

          {/* CTAs */}
          <div ref={ctasRef} className="hero-ctas">
            <button
              className="btn-primary"
              onClick={() => scrollToSection('cta')}
              aria-label={t('hero.cta_primary')}
            >
              {t('hero.cta_primary')}
            </button>
            <button
              className="btn-secondary"
              onClick={() => scrollToSection('royaltips')}
              aria-label={t('hero.cta_secondary')}
            >
              {t('hero.cta_secondary')}
            </button>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="hero-stats">
            <div className="hero-stat-card">
              <div className="hero-stat-number">{t('hero.stat1_number')}</div>
              <div className="hero-stat-subtitle">{t('hero.stat1_subtitle')}</div>
              <div className="hero-stat-body">{t('hero.stat1_body')}</div>
            </div>
            <div className="hero-stat-card">
              <div className="hero-stat-number">{t('hero.stat2_number')}</div>
              <div className="hero-stat-subtitle">{t('hero.stat2_subtitle')}</div>
              <div className="hero-stat-body">{t('hero.stat2_body')}</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
