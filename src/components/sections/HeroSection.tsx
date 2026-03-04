import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import ArtysTicker from '../ui/Ticker';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const { t } = useTranslation();
  const containerRef  = useRef<HTMLDivElement>(null);
  const badgeRef      = useRef<HTMLDivElement>(null);
  const titleRef      = useRef<HTMLDivElement>(null);
  const subtitleRef   = useRef<HTMLParagraphElement>(null);
  const ctasRef       = useRef<HTMLDivElement>(null);
  const tickerRef     = useRef<HTMLDivElement>(null);
  const underlinePath = useRef<SVGPathElement>(null);

  useGSAP(() => {
    // Badge
    gsap.fromTo(badgeRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 }
    );

    // Title words
    const words = titleRef.current?.querySelectorAll('.word');
    if (words?.length) {
      gsap.fromTo(words,
        { opacity: 0, y: 60, rotateX: -20 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.2 }
      );
    }

    // Underline
    if (underlinePath.current) {
      gsap.fromTo(underlinePath.current,
        { strokeDashoffset: 400 },
        { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut', delay: 1.35 }
      );
    }

    // Subtitle
    gsap.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.9 });

    // CTAs
    gsap.to(ctasRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 1.1 });

    // Ticker
    gsap.to(tickerRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 1.4 });

  }, { scope: containerRef });

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" ref={containerRef} id="hero">
      <div className="hero-bg" aria-hidden="true" />

      <div className="container">
        <div className="hero-content" style={{ maxWidth: '860px' }}>

          {/* Badge */}
          <div ref={badgeRef} className="section-badge">
            <span>✦</span>
            {t('hero.badge')}
          </div>

          {/* Title */}
          <div ref={titleRef} className="hero-title" style={{ perspective: '800px' }}>
            <span className="word">{t('hero.title_1')}</span>
            {' '}
            <span className="word">{t('hero.title_2')}</span>
            {' '}
            <br className="line-break" />
            <span className="word hero-underline-wrap" style={{ color: 'var(--accent)' }}>
              {t('hero.title_highlight')}
              <svg className="hero-underline-svg" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true">
                <path ref={underlinePath}
                  d="M4 8 Q75 2 150 6 Q225 10 296 4"
                  strokeDasharray="400" strokeDashoffset="400" />
              </svg>
            </span>
            {' '}
            <span className="word">{t('hero.title_3')}</span>
          </div>

          {/* Subtitle */}
          <p ref={subtitleRef} className="hero-subtitle">
            {t('hero.subtitle')}
          </p>

          {/* CTAs */}
          <div ref={ctasRef} className="hero-ctas">
            <button className="btn-primary" onClick={() => scrollTo('cta')}>
              {t('hero.cta_primary')}
            </button>
            <button className="btn-secondary" onClick={() => scrollTo('echo')}>
              {t('hero.cta_secondary')}
            </button>
          </div>

          {/* Live Ticker */}
          <div ref={tickerRef} style={{ opacity: 0, transform: 'translateY(16px)' }}>
            <ArtysTicker />
          </div>

        </div>
      </div>
    </section>
  );
}
