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
          scrollTrigger: { trigger: el, start: 'top 87%', once: true },
        }
      );
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

        {/* Header centré */}
        <div className="problem-header" data-anim>
          <div className="section-badge" style={{ justifyContent: 'center' }}>
            <span>⚡</span>
            {t('problem.tag')}
          </div>
          <h2 className="problem-title">
            {t('problem.title')}
            {' '}
            <span className="accent-text" style={{ color: 'var(--accent-red)' }}>
              {t('problem.title_highlight')}
            </span>
            {t('problem.title_end')}
          </h2>
          <p className="problem-subtitle" data-anim
            dangerouslySetInnerHTML={{ __html: t('problem.p1') }}
          />
          <p className="problem-subtitle" data-anim
            dangerouslySetInnerHTML={{ __html: t('problem.p2') }}
          />
        </div>

        {/* Bloc IA centré */}
        <div className="problem-ia-wrap" data-anim>
          <div className="problem-ia-title">
            {t('problem.ia_title')}
          </div>
          <ul className="problem-ia-list" role="list">
            {iaItems.map((item, i) => (
              <li key={i} className="problem-ia-item">
                <span className="problem-ia-dot" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
