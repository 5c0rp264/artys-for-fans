# Artys Music — Landing Fans

> La première plateforme de streaming équitable. Soutiens tes artistes préférés via **Royaltips™**.

## 🌐 URLs

- **Dev sandbox** : https://3000-inc0tu7ejd5fre7q9gy46-cbeee0f9.sandbox.novita.ai
- **Repo artiste (référence)** : https://github.com/ArtysFactory/artys-landing-rebranded
- **Landing artistes** : https://artists.artysmusic.com

---

## ✅ Fonctionnalités implémentées

### Design System Artys (fidèle à DESIGN_SYSTEM.md)
- **Couleurs** : `#000` bg · `#00e5b0` accent · `#fa5655` toggle · `#ff4d4d` rouge · `#ffe066` jaune
- **Polices** : Jost 900 (titres) · Inter (corps) · DM Mono (badges/mono)
- **Variables CSS** complètes : `--accent`, `--surface`, `--bg2`, `--border`, etc.

### Animations GSAP 3
- **Hero** : Word-split stagger (opacité + y + rotateX, 0.08s stagger)
- **Soulignement SVG** : strokeDashoffset animé delay 1.35s
- **Scroll reveal** : Fade + y40 ScrollTrigger (once: true) sur toutes les sections
- **Count-up** : Compteurs animés ScrollTrigger (82%, 0.004$, 25M, 333, 1000)
- **Cursor glow** : Suivi souris fluide (lerp 0.08)
- **Grain overlay** : Texture cinématographique SVG animée
- **Ring rotation** : Gouvernance — anneau 40s linear infinite

### Internationalisation FR / EN / ES
- **i18next** avec `i18next-browser-languagedetector`
- Détection auto → fallback FR
- Switch langue via boutons navbar (persistance localStorage)
- Traductions 100% complètes dans `src/locales/`

### Toggle Fans / Artistes
- Toggle `#fa5655` en Navbar, côté Fans actif (blanc plein)
- Clic "Pour les artistes" → `window.open('https://artists.artysmusic.com')`
- Pastille animée CSS (cubic-bezier spring)

### Sections (7)
1. **Hero** — Badge + H1 animé mot par mot + CTA + 2 stat cards
2. **Royaltips™** — 3 étapes numérotées + 4 feature cards avec icônes
3. **Problème** — Texte + 3 data cards (0,004$ / 82% / ×2) + IA block sticky
4. **Comparaison** — Table responsive 3 colonnes + 3 callout count-up
5. **Gouvernance** — Ring animé 3 nodes + 3 membership cards (Fan highlighted)
6. **CTA** — Formulaire waitlist react-hook-form + Zod + pulse background
7. **Footer** — 4 colonnes + mentions légales

### Formulaire
- **react-hook-form** + **Zod** validation
- Champs : prénom, email, artiste favori
- State success avec animation ✦
- Prêt à brancher Supabase / Resend

### UX
- Fully responsive (mobile → desktop, breakpoints 360/480/640/768/900/1180px)
- Scroll-to-top button (apparaît après 600px)
- `translate="no"` + `<meta name="google" content="notranslate">` (pas de traduction Chrome)

---

## 🛠 Stack Technique

| Outil | Version | Rôle |
|-------|---------|------|
| React | 18 | UI |
| Vite | 7 | Build |
| TypeScript | 5 | Types |
| GSAP | 3 | Animations |
| @gsap/react | latest | Hook useGSAP |
| i18next | latest | i18n |
| react-i18next | latest | Bindings React |
| react-hook-form | 7 | Formulaire |
| Zod | 3 | Validation |

---

## 📁 Structure

```
src/
├── components/
│   ├── effects/
│   │   └── CursorGlow.tsx
│   └── sections/
│       ├── Navbar.tsx
│       ├── HeroSection.tsx
│       ├── RoyaltipsSection.tsx
│       ├── ProblemSection.tsx
│       ├── ComparisonSection.tsx
│       ├── GovernanceSection.tsx
│       ├── CTASection.tsx
│       └── Footer.tsx
├── locales/
│   ├── fr.json
│   ├── en.json
│   └── es.json
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🚀 Commandes

```bash
npm run dev      # Dev server port 3000
npm run build    # Build prod → dist/
npm run preview  # Preview du build

# PM2 (sandbox)
pm2 start ecosystem.config.cjs
pm2 logs artys-fans --nostream
```

---

## 🔌 Prochaines étapes

1. **Brancher Supabase** — table `fans_waitlist(id, name, email, artist, locale, created_at)`
2. **Brancher Resend** — email de confirmation à l'inscription
3. **Déployer sur Cloudflare Pages** — `npm run build && wrangler pages deploy dist`
4. **OG Images** par locale
5. **Analytics** Plausible / Cloudflare Analytics
6. **A/B testing** variants du Hero

---

## 📊 Statut

- ✅ Build : Zéro erreur, zéro warning
- ✅ Console JS : Propre (403 fonts = CORS sandbox, résolu en prod)
- ✅ i18n : FR/EN/ES 100%
- ✅ GSAP : Toutes animations actives
- **Dernière mise à jour** : Mars 2026
