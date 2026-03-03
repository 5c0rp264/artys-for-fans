import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const TABLE_DATA = [
  {
    metricKey: 'comparison.row1_metric',
    streaming: { text: '~0,004 $', class: 'red-val' },
    hybrid:    { text: '~2,00 $',  class: '' },
    royaltips: { text: '3 – 6 $',  class: 'accent-val' },
  },
  {
    metricKey: 'comparison.row2_metric',
    streaming: { text: '~0,40 $',  class: 'red-val' },
    hybrid:    { text: '~200 $',   class: '' },
    royaltips: { text: '300 – 600 $', class: 'accent-val' },
  },
  {
    metricKey: 'comparison.row3_metric',
    streaming: { text: '~2 $',     class: 'red-val' },
    hybrid:    { text: '~1 000 $', class: '' },
    royaltips: { text: '1 500 – 3 000 $', class: 'accent-val' },
  },
  {
    metricKey: 'comparison.row4_metric',
    streaming: { text: '~4 $',     class: 'red-val' },
    hybrid:    { text: '~2 000 $', class: '' },
    royaltips: { text: '3 000 – 6 000 $', class: 'accent-val' },
  },
];

interface CalloutData {
  numberClass: string;
  numberKey: string;
  labelKey: string;
  subKey: string;
  countTarget: number;
  countSuffix: string;
  countDecimals: number;
}

const CALLOUTS: CalloutData[] = [
  {
    numberClass: 'red',
    numberKey: 'comparison.callout1_number',
    labelKey: 'comparison.callout1_label',
    subKey: 'comparison.callout1_sub',
    countTarget: 25,
    countSuffix: ' M',
    countDecimals: 0,
  },
  {
    numberClass: 'green',
    numberKey: 'comparison.callout2_number',
    labelKey: 'comparison.callout2_label',
    subKey: 'comparison.callout2_sub',
    countTarget: 333,
    countSuffix: '',
    countDecimals: 0,
  },
  {
    numberClass: 'yellow',
    numberKey: 'comparison.callout3_number',
    labelKey: 'comparison.callout3_label',
    subKey: 'comparison.callout3_sub',
    countTarget: 1000,
    countSuffix: '',
    countDecimals: 0,
  },
];

export default function ComparisonSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);
  const calloutRefs = useRef<(HTMLElement | null)[]>([]);

  useGSAP(() => {
    // Fade in animated elements
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

    // Count-up for callout numbers
    CALLOUTS.forEach((callout, i) => {
      const el = calloutRefs.current[i];
      if (!el) return;
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: callout.countTarget,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              const num = Math.round(obj.val);
              el.textContent = `${num.toLocaleString('fr-FR')}${callout.countSuffix}`;
            },
          });
        },
      });
    });

  }, { scope: containerRef });

  return (
    <section className="comparison-section" ref={containerRef} id="comparison">
      <div className="container">

        {/* Header */}
        <div className="section-title" data-anim>
          <div className="section-badge">
            <span>📊</span>
            {t('comparison.tag')}
          </div>
          <h2>
            {t('comparison.title')}
            <span className="accent-text">{t('comparison.title_highlight')}</span>
            {t('comparison.title_end')}
          </h2>
          <p>{t('comparison.subtitle')}</p>
        </div>

        {/* Table */}
        <div className="comparison-table-wrap" data-anim>
          <table className="comparison-table" role="table" aria-label="Comparaison des revenus">
            <thead>
              <tr>
                <th style={{ width: '28%', color: 'var(--text-secondary)' }}>—</th>
                <th style={{ color: 'var(--accent-red)' }}>{t('comparison.col_streaming')}</th>
                <th>
                  {t('comparison.col_hybrid')}
                  <span className="col-sub">{t('comparison.col_hybrid_sub')}</span>
                </th>
                <th className="col-highlight">
                  {t('comparison.col_royaltips')}
                  <span className="badge-recommended">{t('comparison.badge_recommended')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {TABLE_DATA.map((row, i) => (
                <tr key={i}>
                  <td className="metric-label">{t(row.metricKey)}</td>
                  <td className={row.streaming.class}>{row.streaming.text}</td>
                  <td>{row.hybrid.text}</td>
                  <td className={`col-highlight ${row.royaltips.class}`}>{row.royaltips.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Callouts */}
        <div className="callouts-grid">
          {CALLOUTS.map((callout, i) => (
            <div key={i} className="callout-card" data-anim>
              <div
                className={`callout-number ${callout.numberClass}`}
                ref={el => { calloutRefs.current[i] = el; }}
              >
                {t(callout.numberKey)}
              </div>
              <div className="callout-label">{t(callout.labelKey)}</div>
              <div className="callout-sub">{t(callout.subKey)}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
