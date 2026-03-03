import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

gsap.registerPlugin(ScrollTrigger);

// Zod schema for form validation
const formSchema = z.object({
  name: z.string().min(1, 'Requis'),
  email: z.string().email('Email invalide'),
  artist: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CTASection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

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

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Simulate API call — to wire to backend/Supabase/Resend
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Waitlist signup:', data);
      setSubmitted(true);
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="cta-section" ref={containerRef} id="cta">
      <div className="cta-pulse" aria-hidden="true" />

      <div className="container">
        <div className="cta-inner">

          {/* Text side */}
          <div className="cta-text" data-anim>
            <span className="eyebrow">{t('cta_section.eyebrow')}</span>
            <h2>
              <span className="accent-text">{t('cta_section.title_highlight')}</span>
              <br />
              {t('cta_section.title_end')}
            </h2>
            <p>{t('cta_section.subtitle')}</p>

            <div className="cta-buttons">
              <button
                className="btn-primary"
                onClick={() => document.querySelector('.cta-form form')?.dispatchEvent(new Event('focus'))}
                aria-label={t('cta_section.cta_primary')}
              >
                {t('cta_section.cta_primary')}
              </button>
              <a
                href="mailto:hello@artysmusic.com"
                className="btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('cta_section.cta_secondary')}
              </a>
            </div>

            <p className="cta-note">{t('cta_section.note')}</p>
          </div>

          {/* Form side */}
          <div data-anim>
            <div className="cta-form">
              {!submitted ? (
                <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Formulaire d'inscription">
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">
                      {t('cta_section.field_name_label')}
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={`form-input${errors.name ? ' error' : ''}`}
                      placeholder={t('cta_section.field_name_placeholder')}
                      autoComplete="given-name"
                      {...register('name')}
                    />
                    {errors.name && (
                      <span className="form-error" role="alert">{errors.name.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      {t('cta_section.field_email_label')}
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`form-input${errors.email ? ' error' : ''}`}
                      placeholder={t('cta_section.field_email_placeholder')}
                      autoComplete="email"
                      {...register('email')}
                    />
                    {errors.email && (
                      <span className="form-error" role="alert">{errors.email.message}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="artist">
                      {t('cta_section.field_artist_label')}
                    </label>
                    <input
                      id="artist"
                      type="text"
                      className="form-input"
                      placeholder={t('cta_section.field_artist_placeholder')}
                      {...register('artist')}
                    />
                  </div>

                  <button
                    type="submit"
                    className="form-submit-btn"
                    disabled={loading}
                    aria-label={t('cta_section.form_submit')}
                  >
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
