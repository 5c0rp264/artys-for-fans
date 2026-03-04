// ─── MiniOrb — petite orbe jaune pulsante réutilisable ────────────────────────
// Usage: <MiniOrb /> — remplace les emojis icônes dans les section-badge et listes

export default function MiniOrb({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = {
    sm: { wrap: 20, core: 10, r1: 16, r2: 22 },
    md: { wrap: 28, core: 14, r1: 22, r2: 30 },
    lg: { wrap: 36, core: 18, r1: 28, r2: 38 },
  }[size];

  return (
    <span
      className="mini-orb-wrap"
      aria-hidden="true"
      style={{ width: s.wrap, height: s.wrap, flexShrink: 0 }}
    >
      <span className="mini-orb-ring mini-orb-ring-2" style={{ width: s.r2, height: s.r2 }} />
      <span className="mini-orb-ring mini-orb-ring-1" style={{ width: s.r1, height: s.r1 }} />
      <span className="mini-orb-core" style={{ width: s.core, height: s.core }} />
    </span>
  );
}
