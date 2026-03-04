import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

// ─── Logo Ark of Culture ──────────────────────────────────────────────────────
function ArkLogo() {
  return (
    <img
      src="/ark-of-culture.png"
      alt="Ark of Culture"
      className="ark-logo-img"
    />
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
