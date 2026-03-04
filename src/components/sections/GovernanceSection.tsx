import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

// ─── Logo Ark of Culture SVG ──────────────────────────────────────────────────
function ArkLogo() {
  return (
    <svg
      className="ark-logo-svg"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Ark of Culture"
      role="img"
    >
      {/* Cercle extérieur animé */}
      <circle cx="100" cy="100" r="95" stroke="rgba(0,229,176,0.18)" strokeWidth="1" />
      <circle cx="100" cy="100" r="95" stroke="rgba(0,229,176,0.35)" strokeWidth="1"
        strokeDasharray="40 560" strokeLinecap="round"
        style={{ animation: 'arkOrbit 8s linear infinite', transformOrigin: '100px 100px' }} />

      {/* Cercle intermédiaire */}
      <circle cx="100" cy="100" r="68" stroke="rgba(0,229,176,0.1)" strokeWidth="1" />
      <circle cx="100" cy="100" r="68" stroke="rgba(0,229,176,0.25)" strokeWidth="1"
        strokeDasharray="20 408" strokeLinecap="round"
        style={{ animation: 'arkOrbit 5s linear infinite reverse', transformOrigin: '100px 100px' }} />

      {/* Cercle intérieur */}
      <circle cx="100" cy="100" r="44" fill="rgba(0,229,176,0.04)" stroke="rgba(0,229,176,0.3)" strokeWidth="1.5" />

      {/* Arc / arche stylisée au centre */}
      <path
        d="M76 108 Q76 80 100 80 Q124 80 124 108"
        stroke="#00E5B0" strokeWidth="2.5" strokeLinecap="round" fill="none"
      />
      <line x1="72" y1="108" x2="128" y2="108" stroke="#00E5B0" strokeWidth="2" strokeLinecap="round" />
      <line x1="76" y1="108" x2="76" y2="118" stroke="#00E5B0" strokeWidth="2" strokeLinecap="round" />
      <line x1="124" y1="108" x2="124" y2="118" stroke="#00E5B0" strokeWidth="2" strokeLinecap="round" />

      {/* Nœuds collèges */}
      {/* Artistes — haut */}
      <circle cx="100" cy="5" r="7" fill="var(--surface,#1a1a1a)" stroke="rgba(0,229,176,0.4)" strokeWidth="1.5" />
      <text x="100" y="8.5" textAnchor="middle" fontSize="7" fill="#00E5B0">♪</text>
      {/* Pros — bas gauche */}
      <circle cx="18" cy="152" r="7" fill="var(--surface,#1a1a1a)" stroke="rgba(0,229,176,0.4)" strokeWidth="1.5" />
      <text x="18" y="155.5" textAnchor="middle" fontSize="7" fill="#00E5B0">⊞</text>
      {/* Fans — bas droite */}
      <circle cx="182" cy="152" r="7" fill="var(--surface,#1a1a1a)" stroke="rgba(0,229,176,0.4)" strokeWidth="1.5" />
      <text x="182" y="155.5" textAnchor="middle" fontSize="7" fill="#00E5B0">♥</text>

      {/* Lignes de connexion vers le centre */}
      <line x1="100" y1="12" x2="100" y2="56" stroke="rgba(0,229,176,0.12)" strokeWidth="1" />
      <line x1="24" y1="147" x2="62" y2="118" stroke="rgba(0,229,176,0.12)" strokeWidth="1" />
      <line x1="176" y1="147" x2="138" y2="118" stroke="rgba(0,229,176,0.12)" strokeWidth="1" />
    </svg>
  );
}

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

  const pricingTiers = [
    {
      nameKey: 'governance.member1_name',
      descKey:  'governance.member1_desc',
      priceKey: 'governance.member1_price',
      icon: '🎵',
      isFan: false,
    },
    {
      nameKey: 'governance.member2_name',
      descKey:  'governance.member2_desc',
      priceKey: 'governance.member2_price',
      icon: '🏢',
      isFan: false,
    },
    {
      nameKey: 'governance.member3_name',
      descKey:  'governance.member3_desc',
      priceKey: 'governance.member3_price',
      icon: '❤️',
      isFan: true,
    },
  ];

  return (
    <section className="governance-section" ref={containerRef} id="governance">
      <div className="container">

        <div className="governance-grid">

          {/* ── Colonne gauche : texte ─────────────────────────── */}
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

          {/* ── Colonne droite : logo + tarifs ────────────────── */}
          <div className="governance-right" data-anim>

            {/* Logo Ark of Culture */}
            <div className="ark-logo-wrap">
              <ArkLogo />
              <div className="ark-logo-label">
                <span className="ark-logo-name">Ark of Culture</span>
                <span className="ark-logo-sub">{t('governance.federation_sub') || 'Fédération'}</span>
              </div>
            </div>

            {/* Tarifs d'adhésion */}
            <div className="gov-pricing" data-anim>
              <div className="gov-pricing-title">
                {t('governance.pricing_label') || 'Adhésions'}
              </div>
              <div className="gov-pricing-rows">
                {pricingTiers.map((tier, i) => (
                  <div key={i} className={`gov-pricing-row${tier.isFan ? ' gov-pricing-row-fan' : ''}`}>
                    <span className="gov-tier-icon" aria-hidden="true">{tier.icon}</span>
                    <div className="gov-tier-info">
                      <span className="gov-tier-name">{t(tier.nameKey)}</span>
                      <span className="gov-tier-desc">{t(tier.descKey)}</span>
                    </div>
                    <span className="gov-tier-price">{t(tier.priceKey)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
