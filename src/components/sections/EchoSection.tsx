import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import EchoPhoneLive from '../ui/EchoPhoneLive';

gsap.registerPlugin(ScrollTrigger);

// ─── System prompt ECHO (used by other components) ────────────────────────────
export const ECHO_SYSTEM_PROMPT = `Tu es ECHO, l'assistant musical d'Artys.`;

// ─── Section principale ───────────────────────────────────────────────────────
export default function EchoSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    gsap.fromTo(
      sectionRef.current.querySelectorAll('[data-anim]'),
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      }
    );
  }, { scope: sectionRef });

  const features = [
    {
      title: 'Recommandations Intelligentes',
      desc: 'ECHO analyse vos goûts musicaux pour créer des playlists personnalisées qui évoluent avec vos préférences.',
    },
    {
      title: 'Conversation Naturelle',
      desc: 'Demandez simplement à ECHO de trouver la musique parfaite pour votre moment. Elle comprend et répond naturellement.',
    },
    {
      title: 'Découverte Artistique',
      desc: 'ECHO vous fait découvrir des artistes émergents qui correspondent à votre style, tout en soutenant les créateurs.',
    },
  ];

  return (
    <section className="echo-section" id="echo" ref={sectionRef}>
      <div className="container">

        {/* Header centré */}
        <div className="echo-section-header" data-anim>
          <div className="section-badge" style={{ justifyContent: 'center' }}>
            <span>🎧</span> ECHO
          </div>
          <h2 style={{ textAlign: 'center', marginTop: '12px' }}>
            {t('echo.title_1')}
            <span className="accent-text"> {t('echo.title_highlight')}</span>
            {t('echo.title_end')}
          </h2>
          <p className="echo-section-sub" data-anim>{t('echo.subtitle')}</p>
        </div>

        {/* Layout 2 colonnes : phone à gauche, features à droite */}
        <div className="echo-main-grid" data-anim>

          {/* Colonne gauche — phone mockup live */}
          <div className="echo-phone-col">
            <EchoPhoneLive />
          </div>

          {/* Colonne droite — 3 features avec mini-orb */}
          <div className="echo-features-col">
            {features.map((feat, i) => (
              <div key={i} className="echo-feature-item" data-anim>
                {/* Mini orb pulsante jaune */}
                <div className="echo-mini-orb-wrap" aria-hidden="true">
                  <div className="echo-mini-orb-ring echo-mini-orb-ring-2" />
                  <div className="echo-mini-orb-ring echo-mini-orb-ring-1" />
                  <div className="echo-mini-orb" />
                </div>
                <div className="echo-feature-body">
                  <h4 className="echo-feature-title">{feat.title}</h4>
                  <p className="echo-feature-desc">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
