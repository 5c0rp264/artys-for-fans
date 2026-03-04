import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

export default function SocialProofSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    containerRef.current?.querySelectorAll('[data-anim]').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 87%', once: true },
      });
    });
  }, { scope: containerRef });

  return (
    <section className="social-section" ref={containerRef} id="social">
      <div className="container">

        <div className="section-title" data-anim style={{ textAlign: 'center' }}>
          <div className="section-badge" style={{ justifyContent: 'center' }}>
            <span>❤️</span>
            {t('social.tag')}
          </div>
          <h2 style={{ textAlign: 'center' }}>
            {t('social.title')}
            <span className="accent-text">{t('social.title_highlight')}</span>
          </h2>
        </div>

        {/* Story card */}
        <div className="social-story-card" data-anim>
          <div className="social-story-left">
            {/* Avatar */}
            <div className="social-avatar" aria-hidden="true">
              <div className="social-avatar-inner">S</div>
            </div>
            <div className="social-avatar-info">
              <strong>Sarah M.</strong>
              <span>{t('social.fan_since')}</span>
            </div>
          </div>

          <div className="social-story-content">
            <p className="social-story-text" dangerouslySetInnerHTML={{ __html: t('social.story_text') }} />

            {/* Stats inline */}
            <div className="social-story-stats">
              <div className="social-stat">
                <span className="social-stat-num">15€</span>
                <span className="social-stat-label">{t('social.stat1_label')}</span>
              </div>
              <div className="social-stat">
                <span className="social-stat-num">3 ans</span>
                <span className="social-stat-label">{t('social.stat2_label')}</span>
              </div>
              <div className="social-stat">
                <span className="social-stat-num">1</span>
                <span className="social-stat-label">{t('social.stat3_label')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quote finale */}
        <blockquote className="social-quote" data-anim>
          <span className="social-quote-mark" aria-hidden="true">"</span>
          {t('social.quote')}
          <span className="social-quote-mark" aria-hidden="true">"</span>
        </blockquote>

      </div>
    </section>
  );
}
