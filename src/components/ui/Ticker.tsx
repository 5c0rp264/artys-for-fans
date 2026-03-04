import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const INITIAL_ARTISTS = 1284;
const INITIAL_EUROS   = 48320;
const TICK_INTERVAL_MS = 2800;
const EUROS_PER_TICK   = 6;

function AnimatedDigit({ digit, color }: { digit: string; color: string }) {
  const [current, setCurrent] = useState(digit);
  const [prev, setPrev]       = useState(digit);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (digit !== current) {
      setPrev(current);
      setAnimating(true);
      const t = setTimeout(() => {
        setCurrent(digit);
        setAnimating(false);
      }, 320);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digit]);

  return (
    <span style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', height: '1.15em', verticalAlign: 'bottom' }}>
      {animating && (
        <span style={{
          position: 'absolute', top: 0, left: 0,
          animation: 'tickerSlideOut 0.32s cubic-bezier(.4,0,.2,1) forwards',
          color,
        }}>{prev}</span>
      )}
      <span style={{
        display: 'block',
        animation: animating ? 'tickerSlideIn 0.32s cubic-bezier(.4,0,.2,1) forwards' : 'none',
        color,
      }}>{current}</span>
    </span>
  );
}

function AnimatedNumber({ value, color = '#00E5B0' }: { value: number; color?: string }) {
  const chars = value.toLocaleString('fr-FR').split('');
  return (
    <span style={{ display: 'inline-flex', alignItems: 'flex-end', lineHeight: 1 }}>
      {chars.map((ch, i) =>
        /\d/.test(ch)
          ? <AnimatedDigit key={`${i}-${ch}`} digit={ch} color={color} />
          : <span key={i} style={{ color, marginBottom: '0.05em' }}>{ch}</span>
      )}
    </span>
  );
}

function LiveDot() {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginRight: '8px' }}>
      <span className="ticker-live-dot" />
    </span>
  );
}

export default function ArtysTicker() {
  const { i18n } = useTranslation();
  const [artists, setArtists] = useState(INITIAL_ARTISTS);
  const [euros,   setEuros]   = useState(INITIAL_EUROS);
  const [flash,   setFlash]   = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lang = i18n.language.slice(0, 2) as 'fr' | 'en' | 'es';

  const labels = {
    fr: { mid: ' artistes ont reçu ', post: '€ de Royaltips ce mois' },
    en: { mid: ' artists received ',  post: '€ in Royaltips this month' },
    es: { mid: ' artistas recibieron ', post: '€ en Royaltips este mes' },
  };
  const { mid, post } = labels[lang] || labels.fr;

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setArtists(a => a + 1);
      setEuros(e => e + EUROS_PER_TICK);
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    }, TICK_INTERVAL_MS);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  return (
    <div className={`ticker-wrap${flash ? ' ticker-flash' : ''}`}>
      <LiveDot />
      <span className="ticker-number">
        <AnimatedNumber value={artists} />
      </span>
      <span style={{ margin: '0 4px', color: 'var(--text-secondary)', fontSize: '13px' }}>{mid}</span>
      <span className="ticker-number">
        <AnimatedNumber value={euros} />
      </span>
      <span style={{ marginLeft: '4px', color: 'var(--text-secondary)', fontSize: '13px' }}>{post}</span>
    </div>
  );
}
