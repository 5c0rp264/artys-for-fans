import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

export default function GovernanceSection() {
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

  const members = [
    { nameKey: 'governance.member1_name', descKey: 'governance.member1_desc', priceKey: 'governance.member1_price', isFan: false },
    { nameKey: 'governance.member2_name', descKey: 'governance.member2_desc', priceKey: 'governance.member2_price', isFan: false },
    { nameKey: 'governance.member3_name', descKey: 'governance.member3_desc', priceKey: 'governance.member3_price', isFan: true },
  ];

  const collegeNodes = [
    { labelKey: 'governance.college_artists', icon: '🎵', angle: -90 },
    { labelKey: 'governance.college_fans',    icon: '❤️', angle: 30 },
    { labelKey: 'governance.college_pros',    icon: '🏢', angle: 150 },
  ];

  return (
    <section className="governance-section" ref={containerRef} id="governance">
      <div className="container">

        <div className="governance-grid">
          {/* Text */}
          <div className="governance-text" data-anim>
            <div className="section-badge">
              <span>🏛</span>
              {t('governance.tag')}
            </div>
            <h2 style={{ marginBottom: '24px' }}>
              {t('governance.title')}
              {' '}
              <span className="accent-text">{t('governance.title_highlight')}</span>
              {t('governance.title_end')}
            </h2>
            <p dangerouslySetInnerHTML={{ __html: t('governance.p1') }} />
            <p dangerouslySetInnerHTML={{ __html: t('governance.p2') }} />

            {/* Member cards */}
            <div className="member-cards" data-anim>
              {members.map((m, i) => (
                <div key={i} className={`member-card${m.isFan ? ' fan-card' : ''}`}>
                  <div className="member-name">{t(m.nameKey)}</div>
                  <div className="member-desc">{t(m.descKey)}</div>
                  <div className="member-price">{t(m.priceKey)}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '32px' }} data-anim>
              <a
                href="https://artysmusic.com/federation"
                className="btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('governance.cta')}
              </a>
            </div>
          </div>

          {/* Visual Ring */}
          <div className="governance-visual" data-anim>
            <div className="federation-ring" role="img" aria-label="Fédération Ark of Culture">
              {/* Rings */}
              <div className="ring-circle ring-outer" aria-hidden="true" />
              <div className="ring-circle ring-middle" aria-hidden="true" />

              {/* Center */}
              <div className="ring-circle ring-inner" aria-hidden="true">
                <span className="ring-inner-title"
                  style={{ whiteSpace: 'pre-line' }}>
                  {t('governance.federation_title')}
                </span>
                <span className="ring-inner-sub">{t('governance.federation_sub')}</span>
              </div>

              {/* Nodes */}
              {collegeNodes.map((node, i) => {
                const rad = (node.angle * Math.PI) / 180;
                const radius = 145;
                const cx = 160 + radius * Math.cos(rad);
                const cy = 160 + radius * Math.sin(rad);
                return (
                  <div
                    key={i}
                    className="college-node"
                    style={{
                      position: 'absolute',
                      left: `${cx}px`,
                      top: `${cy}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="node-dot">{node.icon}</div>
                    <span className="node-label">{t(node.labelKey)}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
