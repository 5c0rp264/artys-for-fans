import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

export default function ProblemSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const animElements = containerRef.current?.querySelectorAll('[data-anim]');
    animElements?.forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 87%',
            once: true,
          },
        }
      );
    });

    // Count-up animations
    const cards = [
      { selector: '[data-count="1"]', target: 0.004, prefix: '', suffix: ' $', decimals: 3 },
      { selector: '[data-count="2"]', target: 82, prefix: '', suffix: ' %', decimals: 0 },
    ];

    cards.forEach(({ selector, target, prefix, suffix, decimals }) => {
      const el = containerRef.current?.querySelector(selector);
      if (!el) return;
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              (el as HTMLElement).textContent = `${prefix}${obj.val.toFixed(decimals)}${suffix}`;
            },
          });
        },
      });
    });

  }, { scope: containerRef });

  const iaItems = [
    t('problem.ia_1'),
    t('problem.ia_2'),
    t('problem.ia_3'),
    t('problem.ia_4'),
  ];

  return (
    <section className="problem-section" ref={containerRef} id="problem">
      <div className="container">

        {/* Header */}
        <div data-anim>
          <div className="section-badge">
            <span>⚡</span>
            {t('problem.tag')}
          </div>
          <h2 style={{ marginBottom: '32px', maxWidth: '820px' }}>
            {t('problem.title')}
            {' '}
            <span className="accent-text" style={{ color: 'var(--accent-red)' }}>
              {t('problem.title_highlight')}
            </span>
            {t('problem.title_end')}
          </h2>
        </div>

        <div className="problem-grid">
          {/* Left: text + cards */}
          <div>
            <div className="problem-text-block" data-anim>
              <p dangerouslySetInnerHTML={{ __html: t('problem.p1') }} />
              <p dangerouslySetInnerHTML={{ __html: t('problem.p2') }} />
            </div>

            <div className="problem-cards">
              <div className="problem-card" data-anim>
                <div className="problem-card-number" data-count="1">0,004 $</div>
                <div className="problem-card-title">{t('problem.card1_title')}</div>
                <div className="problem-card-desc">{t('problem.card1_desc')}</div>
              </div>
              <div className="problem-card" data-anim>
                <div className="problem-card-number" data-count="2" style={{ color: 'var(--accent-red)' }}>82 %</div>
                <div className="problem-card-title">{t('problem.card2_title')}</div>
                <div className="problem-card-desc">{t('problem.card2_desc')}</div>
              </div>
              <div className="problem-card" data-anim>
                <div className="problem-card-number" style={{ color: 'var(--accent-yellow)' }}>×2</div>
                <div className="problem-card-title">{t('problem.card3_title')}</div>
                <div className="problem-card-desc">{t('problem.card3_desc')}</div>
              </div>
            </div>
          </div>

          {/* Right: IA block */}
          <div data-anim>
            <div className="ia-block">
              <div className="ia-block-title">{t('problem.ia_title')}</div>
              <ul className="ia-list" role="list">
                {iaItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
