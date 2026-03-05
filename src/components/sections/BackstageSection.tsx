import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import MiniOrb from '../ui/MiniOrb';

gsap.registerPlugin(ScrollTrigger);

export default function BackstageSection() {
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

  const fanOrdinary = [
    { text: t('backstage.ordinary_1') },
    { text: t('backstage.ordinary_2') },
    { text: t('backstage.ordinary_3') },
  ];

  const fanGuild = [
    { text: t('backstage.guild_1') },
    { text: t('backstage.guild_2') },
    { text: t('backstage.guild_3') },
    { text: t('backstage.guild_4') },
  ];

  return (
    <section className="backstage-section" ref={containerRef} id="backstage">
      <div className="container">

        <div className="section-title" data-anim>
          <div className="section-badge">
            <MiniOrb size="sm" />
            {t('backstage.tag')}
          </div>
          <h2>
            {t('backstage.title')}
            <span className="accent-text">{t('backstage.title_highlight')}</span>
            {t('backstage.title_end')}
          </h2>
          <p>{t('backstage.subtitle')}</p>
        </div>

        {/* Compare columns */}
        <div className="backstage-compare" data-anim>
          {/* Fan ordinaire */}
          <div className="backstage-col backstage-col-left">
            <div className="backstage-col-label backstage-col-label-muted">
              {t('backstage.col_ordinary')}
            </div>
            <ul className="backstage-list backstage-list-muted">
              {fanOrdinary.map((item, i) => (
                <li key={i} className="backstage-list-item">
                  <MiniOrb size="sm" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Séparateur VS */}
          <div className="backstage-vs" aria-hidden="true">
            <div className="backstage-vs-line" />
            <span className="backstage-vs-label">VS</span>
            <div className="backstage-vs-line" />
          </div>

          {/* Membre Guilde */}
          <div className="backstage-col backstage-col-right">
            <div className="backstage-col-label backstage-col-label-accent">
              {t('backstage.col_guild')}
            </div>
            <ul className="backstage-list backstage-list-accent">
              {fanGuild.map((item, i) => (
                <li key={i} className="backstage-list-item">
                  <MiniOrb size="sm" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '48px' }} data-anim>
          <button
            className="btn-primary"
            onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
          >
            {t('backstage.cta')}
          </button>
        </div>

      </div>
    </section>
  );
}
