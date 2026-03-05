import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  const col1Links = [
    t('footer.col1_link1'), t('footer.col1_link2'),
    t('footer.col1_link3'), t('footer.col1_link4'),
  ];
  const col2Links = [
    t('footer.col2_link1'), t('footer.col2_link2'),
    t('footer.col2_link3'), t('footer.col2_link4'),
  ];
  const col3Links = [
    t('footer.col3_link1'), t('footer.col3_link2'),
    t('footer.col3_link3'), t('footer.col3_link4'),
  ];

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="8" fill="#ffef47" />
                <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
                  fill="#000" fontFamily="Jost, sans-serif" fontWeight="900"
                  fontSize="14" letterSpacing="1">A</text>
              </svg>
              Artys Music
            </div>
            <p className="footer-tagline">{t('footer.tagline')}</p>
          </div>

          {/* Platform */}
          <div>
            <div className="footer-col-title">{t('footer.col1_title')}</div>
            <ul className="footer-links" role="list">
              {col1Links.map((link, i) => (
                <li key={i}><a href="#" aria-label={link}>{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Fédération */}
          <div>
            <div className="footer-col-title">{t('footer.col2_title')}</div>
            <ul className="footer-links" role="list">
              {col2Links.map((link, i) => (
                <li key={i}><a href="#" aria-label={link}>{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <div className="footer-col-title">{t('footer.col3_title')}</div>
            <ul className="footer-links" role="list">
              {col3Links.map((link, i) => (
                <li key={i}><a href="#" aria-label={link}>{link}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <span className="footer-copyright">{t('footer.copyright')}</span>
          <nav className="footer-legal" aria-label="Liens légaux">
            <a href="#">{t('footer.terms')}</a>
            <a href="#">{t('footer.privacy')}</a>
            <a href="#">{t('footer.legal')}</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
