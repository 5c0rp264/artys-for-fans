import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { numKey: 'royaltips.step1_num', titleKey: 'royaltips.step1_title', descKey: 'royaltips.step1_desc' },
  { numKey: 'royaltips.step2_num', titleKey: 'royaltips.step2_title', descKey: 'royaltips.step2_desc' },
  { numKey: 'royaltips.step3_num', titleKey: 'royaltips.step3_title', descKey: 'royaltips.step3_desc' },
];

const FEATURES = [
  { icon: '🎯', titleKey: 'royaltips.feat1_title', descKey: 'royaltips.feat1_desc' },
  { icon: '🚀', titleKey: 'royaltips.feat2_title', descKey: 'royaltips.feat2_desc' },
  { icon: '💰', titleKey: 'royaltips.feat3_title', descKey: 'royaltips.feat3_desc' },
  { icon: '⚡', titleKey: 'royaltips.feat4_title', descKey: 'royaltips.feat4_desc' },
];

export default function RoyaltipsSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const animElements = containerRef.current?.querySelectorAll('[data-anim]');
    animElements?.forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        }
      );
    });
  }, { scope: containerRef });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="royaltips-section" ref={containerRef} id="royaltips">
      <div className="container">

        {/* Header */}
        <div className="section-title" data-anim>
          <div className="section-badge">
            <span>✦</span>
            {t('royaltips.tag')}
          </div>
          <h2>
            {t('royaltips.title')}
            <span className="accent-text">{t('royaltips.title_highlight')}</span>
            {t('royaltips.title_end')}
          </h2>
          <p>{t('royaltips.subtitle')}</p>
        </div>

        {/* How it works */}
        <div data-anim>
          <h3 style={{
            fontFamily: 'var(--font-title)',
            fontWeight: 800,
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-secondary)',
            marginBottom: '24px',
          }}>
            {t('royaltips.how_title')}
          </h3>
        </div>

        <div className="steps-grid">
          {STEPS.map((step, i) => (
            <div key={i} className="step-card" data-anim>
              <span className="step-num">{t(step.numKey)}</span>
              <div className="step-title">{t(step.titleKey)}</div>
              <div className="step-desc">{t(step.descKey)}</div>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div className="features-grid">
          {FEATURES.map((feat, i) => (
            <div key={i} className="feature-card" data-anim>
              <div className="feature-icon" aria-hidden="true">{feat.icon}</div>
              <div className="feature-content">
                <h4>{t(feat.titleKey)}</h4>
                <p>{t(feat.descKey)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: '48px', textAlign: 'center' }} data-anim>
          <button
            className="btn-primary"
            onClick={() => scrollToSection('cta')}
            aria-label={t('royaltips.cta')}
          >
            {t('royaltips.cta')}
          </button>
        </div>

      </div>
    </section>
  );
}
