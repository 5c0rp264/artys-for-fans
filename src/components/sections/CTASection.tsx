import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

gsap.registerPlugin(ScrollTrigger);

// ─── SVG logos réseaux sociaux ────────────────────────────────────────────────
function InstagramLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#f09433" />
          <stop offset="25%"  stopColor="#e6683c" />
          <stop offset="50%"  stopColor="#dc2743" />
          <stop offset="75%"  stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5.5" ry="5.5" fill="url(#ig-grad)" />
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
    </svg>
  );
}

function TikTokLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect width="24" height="24" rx="5.5" fill="#010101" />
      <path
        d="M17.5 5.5A3.5 3.5 0 0 1 14 2h-2.5v13.5a2 2 0 1 1-2-2c.18 0 .36.02.53.06V11a4.5 4.5 0 1 0 4 4.5V9.3A7.48 7.48 0 0 0 17.5 10V7.5A5 5 0 0 1 14 5.5h3.5Z"
        fill="white"
      />
      <path
        d="M17.5 5.5A3.5 3.5 0 0 1 14 2h-2.5v13.5a2 2 0 1 1-2-2c.18 0 .36.02.53.06V11a4.5 4.5 0 1 0 4 4.5V9.3A7.48 7.48 0 0 0 17.5 10V7.5A5 5 0 0 1 14 5.5h3.5Z"
        fill="#69C9D0"
        opacity="0.5"
      />
    </svg>
  );
}

// ─── Genres musicaux ──────────────────────────────────────────────────────────
const MUSIC_GENRES = [
  { value: 'pop',       label: { fr: 'Pop',         en: 'Pop',       es: 'Pop' } },
  { value: 'hiphop',    label: { fr: 'Hip-Hop',      en: 'Hip-Hop',   es: 'Hip-Hop' } },
  { value: 'rnb',       label: { fr: 'R&B / Soul',   en: 'R&B / Soul',es: 'R&B / Soul' } },
  { value: 'electro',   label: { fr: 'Électro',      en: 'Electronic',es: 'Electrónico' } },
  { value: 'rock',      label: { fr: 'Rock',         en: 'Rock',      es: 'Rock' } },
  { value: 'indie',     label: { fr: 'Indie / Alternatif', en: 'Indie / Alternative', es: 'Indie / Alternativo' } },
  { value: 'jazz',      label: { fr: 'Jazz / Blues', en: 'Jazz / Blues', es: 'Jazz / Blues' } },
  { value: 'classique', label: { fr: 'Classique',    en: 'Classical', es: 'Clásica' } },
  { value: 'afro',      label: { fr: 'Afro / World', en: 'Afro / World', es: 'Afro / World' } },
  { value: 'metal',     label: { fr: 'Metal / Punk', en: 'Metal / Punk', es: 'Metal / Punk' } },
  { value: 'reggae',    label: { fr: 'Reggae / Dancehall', en: 'Reggae / Dancehall', es: 'Reggae / Dancehall' } },
  { value: 'other',     label: { fr: 'Autre',        en: 'Other',     es: 'Otro' } },
];

// ─── Validation Zod ───────────────────────────────────────────────────────────
const formSchema = z.object({
  email:     z.string().email('Email invalide'),
  genre:     z.string().min(1, 'Requis'),
  instagram: z.string().optional(),
  tiktok:    z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;

// ─── Helper : normalise le handle (retire @, URL complète) ───────────────────
function cleanHandle(val: string | undefined): string {
  if (!val) return '';
  // Retire URL si collé (ex: https://www.instagram.com/monartiste/)
  const match = val.match(/(?:instagram\.com|tiktok\.com)\/@?([^/?]+)/i);
  if (match) return '@' + match[1].replace(/^@/, '');
  // Sinon ajoute @ si absent
  const h = val.trim().replace(/^@+/, '');
  return h ? '@' + h : '';
}

// ─── Section CTA ──────────────────────────────────────────────────────────────
export default function CTASection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2) as 'fr' | 'en' | 'es';
  const containerRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useGSAP(() => {
    containerRef.current?.querySelectorAll('[data-anim]').forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 87%', once: true },
      });
    });
  }, { scope: containerRef });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Nettoyage des handles avant envoi
      const payload = {
        ...data,
        instagram: cleanHandle(data.instagram),
        tiktok:    cleanHandle(data.tiktok),
      };
      await new Promise(r => setTimeout(r, 800));
      console.log('Fan waitlist signup:', payload);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="cta-section" ref={containerRef} id="cta">
      <div className="cta-pulse" aria-hidden="true" />

      <div className="container">
        <div className="cta-inner">

          {/* Texte */}
          <div className="cta-text" data-anim>
            <span className="eyebrow">{t('cta_section.eyebrow')}</span>
            <h2>
              <span style={{ color: 'var(--text)' }}>Rejoins la </span>
              <span className="accent-text">première communauté</span>
              <span style={{ color: 'var(--text)' }}> musicale</span>
              <br />
              <span style={{ color: 'var(--text)' }}>qui te </span>
              <span style={{ color: '#FF5657' }}>Rémunère.</span>
            </h2>
            <p>{t('cta_section.subtitle')}</p>
            <div className="cta-buttons">
              <a href="mailto:hello@artysmusic.com" className="btn-secondary" target="_blank" rel="noopener noreferrer">
                {t('cta_section.cta_secondary')}
              </a>
            </div>
            <p className="cta-note">{t('cta_section.note')}</p>
          </div>

          {/* Formulaire */}
          <div data-anim>
            <div className="cta-form">
              {!submitted ? (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      {t('cta_section.field_email_label')}
                    </label>
                    <input
                      id="email" type="email"
                      className={`form-input${errors.email ? ' error' : ''}`}
                      placeholder={t('cta_section.field_email_placeholder')}
                      autoComplete="email"
                      {...register('email')}
                    />
                    {errors.email && <span className="form-error" role="alert">{errors.email.message}</span>}
                  </div>

                  {/* Genre musical */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="genre">
                      {t('cta_section.field_genre_label')}
                    </label>
                    <select
                      id="genre"
                      className={`form-input${errors.genre ? ' error' : ''}`}
                      {...register('genre')}
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="">{t('cta_section.field_genre_placeholder')}</option>
                      {MUSIC_GENRES.map(g => (
                        <option key={g.value} value={g.value}>
                          {g.label[lang] || g.label.fr}
                        </option>
                      ))}
                    </select>
                    {errors.genre && <span className="form-error" role="alert">{errors.genre.message}</span>}
                  </div>

                  {/* Artiste à soutenir — Instagram + TikTok */}
                  <div className="form-group">
                    <label className="form-label">
                      {t('cta_section.field_artist_label')}
                    </label>
                    <span className="form-hint" style={{ marginBottom: '12px', display: 'block' }}>
                      {t('cta_section.field_artist_hint')}
                    </span>

                    {/* Instagram */}
                    <div className="form-social-input-wrap">
                      <span className="form-social-icon">
                        <InstagramLogo />
                      </span>
                      <input
                        id="instagram" type="text"
                        className="form-input form-social-input"
                        placeholder={t('cta_section.field_instagram_placeholder')}
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        {...register('instagram')}
                      />
                    </div>

                    {/* TikTok */}
                    <div className="form-social-input-wrap" style={{ marginTop: '10px' }}>
                      <span className="form-social-icon">
                        <TikTokLogo />
                      </span>
                      <input
                        id="tiktok" type="text"
                        className="form-input form-social-input"
                        placeholder={t('cta_section.field_tiktok_placeholder')}
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        {...register('tiktok')}
                      />
                    </div>
                  </div>

                  <button type="submit" className="form-submit-btn" disabled={loading}>
                    {loading ? '...' : t('cta_section.form_submit')}
                  </button>

                  <p className="form-consent">{t('cta_section.form_consent')}</p>
                </form>
              ) : (
                <div className="form-success" role="status" aria-live="polite">
                  <div className="form-success-icon" aria-hidden="true">✦</div>
                  <h3>{t('cta_section.form_success_title')}</h3>
                  <p>{t('cta_section.form_success_body')}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
