import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

export default function FairSection() {
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

  const pillars = [
    { num: '01', titleKey: 'fair.pillar1_title', descKey: 'fair.pillar1_desc' },
    { num: '02', titleKey: 'fair.pillar2_title', descKey: 'fair.pillar2_desc' },
    { num: '03', titleKey: 'fair.pillar3_title', descKey: 'fair.pillar3_desc' },
  ];

  return (
    <section className="fair-section" ref={containerRef} id="fair">
      <div className="container">

        {/* Headline + comparaison */}
        <div className="fair-headline" data-anim>
          <div className="section-badge" style={{ justifyContent: 'center' }}>
            <span>⚖️</span>
            {t('fair.tag')}
          </div>
          <div className="fair-comparison-block">
            <div className="fair-platform fair-platform-dark">
              <span className="fair-platform-name">Spotify</span>
              <span className="fair-stream-value">
                1 stream = <strong style={{ color: 'var(--accent-red)' }}>0,003 $</strong>
              </span>
            </div>
            <div className="fair-arrow" aria-hidden="true">→</div>
            <div className="fair-platform fair-platform-accent">
              <span className="fair-platform-name" style={{ color: 'var(--accent)' }}>Artys</span>
              <span className="fair-stream-value">
                Ton abonnement = l'équivalent de{' '}
                <strong style={{ color: 'var(--accent)' }}>1 000 streams</strong>{' '}
                chaque mois
              </span>
            </div>
          </div>
        </div>

        {/* Trois pilliers — style manifeste */}
        <div className="fair-pillars" data-anim>
          {pillars.map((p, i) => (
            <div key={i} className="fair-pillar-row">
              <span className="fair-pillar-num">{p.num}</span>
              <div className="fair-pillar-body">
                <h4 className="fair-pillar-title">{t(p.titleKey)}</h4>
                <p className="fair-pillar-desc">{t(p.descKey)}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
