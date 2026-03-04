import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import MiniOrb from '../ui/MiniOrb';

gsap.registerPlugin(ScrollTrigger);

interface ReferralRow {
  friends: number;
  reward: string;
  highlight: boolean;
}

export default function ReferralSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);
  const progressRef  = useRef<(HTMLElement | null)[]>([]);

  useGSAP(() => {
    containerRef.current?.querySelectorAll('[data-anim]').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 87%', once: true },
      });
    });

    // Animate progress bars
    progressRef.current.forEach((el, i) => {
      if (!el) return;
      const widths = [10, 50, 100, 100];
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(el, { width: '0%' }, {
            width: `${widths[i]}%`,
            duration: 1.2 + i * 0.2,
            ease: 'power2.out',
            delay: i * 0.15,
          });
        },
      });
    });
  }, { scope: containerRef });

  const rows: ReferralRow[] = [
    { friends: 1,  reward: t('referral.row1_reward'), highlight: false },
    { friends: 5,  reward: t('referral.row2_reward'), highlight: false },
    { friends: 10, reward: t('referral.row3_reward'), highlight: true  },
    { friends: 15, reward: t('referral.row4_reward'), highlight: false },
  ];

  const progressWidths = [10, 50, 100, 100];

  return (
    <section className="referral-section" ref={containerRef} id="referral">
      <div className="container">

        <div className="section-title" data-anim style={{ textAlign: 'center' }}>
          <div className="section-badge" style={{ justifyContent: 'center' }}>
            <MiniOrb size="sm" />
            {t('referral.tag')}
          </div>
          <h2 style={{ textAlign: 'center' }}>
            {t('referral.title')}
            <span className="accent-text">{t('referral.title_highlight')}</span>
            {t('referral.title_end')}
          </h2>
          <p style={{ margin: '0 auto', textAlign: 'center' }}>{t('referral.subtitle')}</p>
        </div>

        {/* Progression gamifiée */}
        <div className="referral-rows" data-anim>
          {rows.map((row, i) => (
            <div key={i} className={`referral-row${row.highlight ? ' referral-row-highlight' : ''}`}>
              <div className="referral-row-header">
                <span className="referral-friends">
                  {row.highlight && <span className="referral-crown" aria-hidden="true">👑 </span>}
                  <strong>{row.friends}</strong> {t('referral.friend_label', { count: row.friends })}
                </span>
                <span className="referral-reward">{row.reward}</span>
              </div>
              <div className="referral-progress-bg" role="progressbar" aria-valuenow={progressWidths[i]} aria-valuemin={0} aria-valuemax={100}>
                <div
                  ref={el => { progressRef.current[i] = el; }}
                  className={`referral-progress-bar${row.highlight ? ' referral-progress-accent' : ''}`}
                  style={{ width: '0%' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Réassurance */}
        <div className="referral-reassurance" data-anim>
          <div className="referral-reassurance-icon" aria-hidden="true">🌱</div>
          <p>{t('referral.reassurance')}</p>
        </div>

      </div>
    </section>
  );
}
