import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

gsap.registerPlugin(ScrollTrigger);

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

const formSchema = z.object({
  email:  z.string().email('Email invalide'),
  genre:  z.string().min(1, 'Requis'),
  artist: z.string().optional(),
});
type FormData = z.infer<typeof formSchema>;

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
      await new Promise(r => setTimeout(r, 800));
      console.log('Fan waitlist signup:', data);
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
              <span className="accent-text">{t('cta_section.title_highlight')}</span>
              <br />
              {t('cta_section.title_end')}
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

                  {/* Artiste favori */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="artist">
                      {t('cta_section.field_artist_label')}
                    </label>
                    <input
                      id="artist" type="text"
                      className="form-input"
                      placeholder={t('cta_section.field_artist_placeholder')}
                      {...register('artist')}
                    />
                    <span className="form-hint">{t('cta_section.field_artist_hint')}</span>
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
