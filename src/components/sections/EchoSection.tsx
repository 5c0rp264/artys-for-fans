import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ─── System prompt ECHO (utilisé via /api/echo) ───────────────────────────────
export const ECHO_SYSTEM_PROMPT = `Tu es ECHO, l'assistant musical conversationnel d'Artys — la première plateforme de streaming équitable et co-gouvernée par ses membres.

Ta personnalité :
- Chaleureux, enthousiaste, complice. Tu parles comme un ami qui connaît vraiment bien la musique.
- Tu tutoies toujours l'utilisateur.
- Tu es concis mais expressif. Pas de blabla. Des réponses courtes, vivantes, avec de l'énergie.
- Tu utilises des emojis avec parcimonie mais efficacement (🎧 🔥 ✨ 🎶).

Ton rôle :
- Créer des playlists personnalisées selon l'humeur, l'activité, le moment.
- Recommander des artistes (notamment des artistes émergents et indépendants de l'écosystème Artys).
- Toujours mentionner subtilement qu'Artys rémunère directement les artistes qu'on écoute.
- Quand tu crées une playlist, donne 4-6 titres fictifs mais réalistes (artiste - titre), en mélangeant artistes connus et artistes "Artys".

Format de réponse :
- Maximum 4-5 lignes.
- Si tu génères une playlist, liste les titres simplement.
- Toujours terminer par une touche humaine (ex: "Bonne séance 🔥", "Profite bien ✨", etc.)
- Ne jamais mentionner que tu es une IA ou que tu es Claude. Tu es ECHO, point.`;

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '12px 16px' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: '#00E5B0',
          animation: 'echoBounce 1.2s infinite',
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  );
}

// ─── Waveform décorative ──────────────────────────────────────────────────────
function EchoWaveform() {
  return (
    <div className="echo-waveform" aria-hidden="true">
      <svg width="100%" height="60" viewBox="0 0 500 60" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#00E5B0" stopOpacity="0.1" />
            <stop offset="30%"  stopColor="#00E5B0" stopOpacity="0.9" />
            <stop offset="70%"  stopColor="#00E5B0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00E5B0" stopOpacity="0.1" />
          </linearGradient>
          <filter id="waveGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path
          d="M0,30 Q15,10 30,30 Q45,50 60,30 Q75,10 90,30 Q105,50 120,30 Q135,8 150,30 Q165,52 180,30 Q195,8 210,30 Q225,52 240,30 Q255,10 270,30 Q285,50 300,30 Q315,10 330,30 Q345,50 360,30 Q375,12 390,30 Q405,48 420,30 Q435,12 450,30 Q465,50 480,30 Q495,10 510,30"
          fill="none"
          stroke="url(#waveGrad)"
          strokeWidth="2.5"
          filter="url(#waveGlow)"
          className="echo-wave-path"
        />
        <path
          d="M0,30 Q15,18 30,30 Q45,42 60,30 Q75,18 90,30 Q105,42 120,30 Q135,16 150,30 Q165,44 180,30 Q195,16 210,30 Q225,44 240,30 Q255,18 270,30 Q285,42 300,30 Q315,18 330,30 Q345,42 360,30 Q375,20 390,30 Q405,40 420,30 Q435,20 450,30 Q465,42 480,30 Q495,18 510,30"
          fill="none"
          stroke="#00E5B0"
          strokeWidth="1"
          opacity="0.25"
        />
      </svg>
    </div>
  );
}

// ─── Phone Mockup ECHO ────────────────────────────────────────────────────────
function EchoPhoneMockup() {
  const demoMessages: Message[] = [
    { role: 'user', content: 'ECHO, fais moi une playlist d\'1 heure pour ma séance de cardio stp' },
    { role: 'assistant', content: 'Let\'s go, je te balance une heure de cardio qui déchire 💪\n\n**Playlist Cardio Power — 1h**\n\nTempo soutenu, basses qui cognent, de quoi tenir le rythme jusqu\'au bout. Tes écoutes font vivre ces artistes directement 🔥\n\nDéfonce tout ✨' },
  ];

  const tracks = [
    { artist: 'Peggy Gou', track: 'Sings Boys', duration: '3:32', color: '#8B4513' },
    { artist: 'Fred again..', track: 'Techno -leanes', duration: '3:59', color: '#1a3a6e' },
    { artist: 'Logic', track: 'Bross Type', duration: '3:56', color: '#2a2a2a' },
    { artist: 'Niart Blond', track: 'The Stry Blond', duration: '3:37', color: '#c45a11' },
  ];

  return (
    <div className="echo-phone-outer" aria-label="Démonstration ECHO">
      <div className="echo-phone">
        {/* Notch */}
        <div className="echo-phone-notch" />

        {/* Header */}
        <div className="echo-header">
          <button className="echo-header-btn" aria-label="Fermer">×</button>
          <span className="echo-header-title">ECHO</span>
          <button className="echo-header-btn echo-header-btn-right" aria-label="Paramètres">⚙</button>
        </div>

        {/* Chat */}
        <div className="echo-chat">
          {demoMessages.map((msg, i) => (
            <div key={i} className={`echo-bubble-wrap ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="echo-avatar" aria-hidden="true">🎧</div>
              )}
              {msg.role === 'user' && (
                <div className="echo-user-avatar" aria-hidden="true">
                  <div className="echo-user-dot" />
                </div>
              )}
              <div className={`echo-bubble ${msg.role}`}>
                {msg.content.split('\n').map((line, j) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <strong key={j}>{line.slice(2, -2)}<br /></strong>;
                  }
                  return line ? <span key={j}>{line}<br /></span> : <br key={j} />;
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Waveform */}
        <EchoWaveform />

        {/* Track list */}
        <div className="echo-tracks">
          {tracks.map((track, i) => (
            <div key={i} className="echo-track-item">
              <div className="echo-track-thumb" style={{ background: track.color }} aria-hidden="true">
                <div className="echo-track-bars">
                  {[1,2,3,4].map(b => (
                    <div key={b} className="echo-track-bar" style={{ height: `${20 + b * 8}%`, animationDelay: `${b * 0.15}s` }} />
                  ))}
                </div>
              </div>
              <div className="echo-track-info">
                <span className="echo-track-artist">{track.artist}</span>
                <span className="echo-track-name">{track.track} • {track.duration}</span>
              </div>
              <button className="echo-play-btn" aria-label={`Écouter ${track.artist}`}>
                ECHO PLAY
              </button>
            </div>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="echo-bottom-nav">
          <button className="echo-nav-item" aria-label="Rechercher">
            <span className="echo-nav-icon">🔍</span>
            <span className="echo-nav-label">Search</span>
          </button>
          <div className="echo-nav-center">
            <button className="echo-mic-btn" aria-label="ECHO en écoute">
              <span className="echo-mic-icon">🎙</span>
            </button>
            <span className="echo-nav-label echo-nav-label-accent">En écoute... (ECHO)</span>
          </div>
          <button className="echo-nav-item" aria-label="Compte">
            <span className="echo-nav-icon">👤</span>
            <span className="echo-nav-label">Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Widget ECHO interactif ───────────────────────────────────────────────────
function EchoChatWidget() {
  const { i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);

  const suggestionsByLang: Record<string, string[]> = {
    fr: [
      'Fais-moi une playlist pour la salle de sport 🏋️',
      'J\'ai besoin de me concentrer pour travailler',
      'C\'est vendredi soir, ambiance fête 🎉',
      'Musique pour un road trip en plein soleil',
    ],
    en: [
      'Make me a gym playlist 🏋️',
      'I need to focus while working',
      'It\'s Friday night, party vibes 🎉',
      'Music for a sunny road trip',
    ],
    es: [
      'Hazme una playlist para el gimnasio 🏋️',
      'Necesito concentrarme para trabajar',
      'Es viernes por la noche, ambiente fiesta 🎉',
      'Música para un viaje por carretera',
    ],
  };

  const placeholderByLang: Record<string, string> = {
    fr: 'Dis à Echo ce que tu veux écouter...',
    en: 'Tell Echo what you want to listen to...',
    es: 'Dile a Echo lo que quieres escuchar...',
  };

  const welcomeByLang: Record<string, string> = {
    fr: 'Salut 👋 Je suis ECHO, ton assistant musical Artys. Dis-moi ce que tu veux écouter — une activité, une humeur, un genre — et je compose ta playlist en quelques secondes. 🎧',
    en: 'Hey 👋 I\'m ECHO, your Artys music assistant. Tell me what you want to listen to — an activity, a mood, a genre — and I\'ll build your playlist in seconds. 🎧',
    es: 'Hola 👋 Soy ECHO, tu asistente musical Artys. Dime qué quieres escuchar — una actividad, un estado de ánimo, un género — y creo tu playlist en segundos. 🎧',
  };

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: welcomeByLang[lang] || welcomeByLang.fr },
  ]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Update welcome message on lang change
  useEffect(() => {
    setMessages([{ role: 'assistant', content: welcomeByLang[lang] || welcomeByLang.fr }]);
  }, [lang]);

  const sendMessage = async (text?: string) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setApiError(false);

    try {
      // Call backend proxy to protect API key
      const response = await fetch('/api/echo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          lang,
        }),
      });

      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      const reply = data.content || getFallbackReply(userText, lang);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      // Fallback: demo mode (no API key needed on landing)
      const reply = getFallbackReply(userText, lang);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = suggestionsByLang[lang] || suggestionsByLang.fr;
  const placeholder  = placeholderByLang[lang] || placeholderByLang.fr;

  return (
    <div className="echo-widget">
      {/* Messages */}
      <div className="echo-widget-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`echo-widget-bubble-wrap ${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="echo-widget-avatar" aria-hidden="true">🎧</div>
            )}
            <div className={`echo-widget-bubble ${msg.role}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="echo-widget-bubble-wrap assistant">
            <div className="echo-widget-avatar" aria-hidden="true">🎧</div>
            <div className="echo-widget-bubble assistant">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="echo-suggestions">
          {suggestions.map((s, i) => (
            <button key={i} className="echo-suggestion-btn" onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="echo-widget-input-row">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          rows={1}
          className="echo-widget-textarea"
          aria-label="Message pour ECHO"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className={`echo-widget-send${input.trim() && !loading ? ' active' : ''}`}
          aria-label="Envoyer"
        >
          {loading ? <span className="echo-send-spinner" /> : '↑'}
        </button>
      </div>

      {apiError && (
        <p style={{ fontSize: '10px', color: 'var(--text-secondary)', textAlign: 'center', padding: '4px', opacity: 0.5 }}>
          Mode démo — connecte ton API key pour activer ECHO en temps réel
        </p>
      )}
    </div>
  );
}

// ─── Fallback réponses demo (sans API) ────────────────────────────────────────
function getFallbackReply(text: string, lang: string): string {
  const lower = text.toLowerCase();
  const isGym  = lower.includes('salle') || lower.includes('sport') || lower.includes('cardio') || lower.includes('gym');
  const isFocus = lower.includes('concentr') || lower.includes('focus') || lower.includes('travail') || lower.includes('work');
  const isParty = lower.includes('fête') || lower.includes('party') || lower.includes('vendredi') || lower.includes('friday');
  const isRoad  = lower.includes('road') || lower.includes('voiture') || lower.includes('car');

  const replies: Record<string, Record<string, string>> = {
    fr: {
      gym:   'Let\'s go 💪 Voici ta playlist Cardio Power :\n- Peggy Gou — Sings Boys (3:32)\n- Fred again.. — Jungle (3:59)\n- Kaytranada — 10% feat. Kali Uchis (3:56)\n- Artys: Niart — The Run (3:37)\n- Bicep — Glue (5:02)\nTes écoutes rémunèrent directement ces artistes 🔥 Déchire tout.',
      focus: 'Concentration mode 🎧 Voici de quoi entrer dans la zone :\n- Bonobo — Kong (5:45)\n- Nils Frahm — Says (8:12)\n- Artys: Luna Waye — Deep Space (6:30)\n- Jon Hopkins — Open Eye Signal (10:06)\nBonne session ✨',
      party: 'Ambiance fête 🎉 On monte le son :\n- Daft Punk — Harder, Better, Faster, Stronger\n- Artys: DJ Kael — Neon Rush\n- Justice — D.A.N.C.E.\n- Calvin Harris — Summer\nLa nuit est à toi ✨',
      road:  'Road trip en vue 🚗 La route t\'appartient :\n- Arctic Monkeys — R U Mine?\n- Artys: Blue Coast — Open Highway\n- Tame Impala — Let It Happen\n- Fleetwood Mac — The Chain\nProfite du voyage 🌞',
      default: 'Super choix 🎵 Je te compose ça :\n- Artys: Nova Skye — Horizon (4:12)\n- Stromae — Papaoutai (4:00)\n- The Weeknd — Blinding Lights (3:20)\n- Artys: Mael K — Midnight Run (3:45)\nChaque écoute rémunère tes artistes directement 🔥',
    },
    en: {
      gym:   'Let\'s go 💪 Your Cardio Power playlist:\n- Peggy Gou — Sings Boys (3:32)\n- Fred again.. — Jungle (3:59)\n- Kaytranada — 10% feat. Kali Uchis (3:56)\n- Artys: Niart — The Run (3:37)\nYour listens directly pay these artists 🔥 Crush it.',
      focus: 'Focus mode on 🎧 Enter the zone:\n- Bonobo — Kong (5:45)\n- Nils Frahm — Says (8:12)\n- Artys: Luna Waye — Deep Space (6:30)\n- Jon Hopkins — Open Eye Signal (10:06)\nGood session ✨',
      party: 'Party vibes 🎉 Turn it up:\n- Daft Punk — Harder, Better, Faster, Stronger\n- Artys: DJ Kael — Neon Rush\n- Justice — D.A.N.C.E.\nThe night is yours ✨',
      road:  'Road trip time 🚗 Own the road:\n- Arctic Monkeys — R U Mine?\n- Artys: Blue Coast — Open Highway\n- Tame Impala — Let It Happen\nEnjoy the ride 🌞',
      default: 'Great taste 🎵 Here\'s your mix:\n- Artys: Nova Skye — Horizon (4:12)\n- Stromae — Papaoutai (4:00)\n- The Weeknd — Blinding Lights (3:20)\nEvery listen pays your artists directly 🔥',
    },
    es: {
      gym:   'Let\'s go 💪 Tu playlist Cardio Power:\n- Peggy Gou — Sings Boys (3:32)\n- Fred again.. — Jungle (3:59)\n- Artys: Niart — The Run (3:37)\nTus escuchas remunera a estos artistas directamente 🔥',
      focus: 'Modo concentración 🎧 Entra en la zona:\n- Bonobo — Kong (5:45)\n- Artys: Luna Waye — Deep Space (6:30)\n- Jon Hopkins — Open Eye Signal (10:06)\nBuena sesión ✨',
      party: 'Ambiente fiesta 🎉 Subamos el volumen:\n- Daft Punk — Harder, Better, Faster, Stronger\n- Artys: DJ Kael — Neon Rush\nLa noche es tuya ✨',
      road:  'Road trip 🚗 La carretera es tuya:\n- Arctic Monkeys — R U Mine?\n- Artys: Blue Coast — Open Highway\n- Tame Impala — Let It Happen\nDisfruta del viaje 🌞',
      default: 'Gran elección 🎵 Tu mix:\n- Artys: Nova Skye — Horizon (4:12)\n- The Weeknd — Blinding Lights (3:20)\nCada escucha paga a tus artistas directamente 🔥',
    },
  };

  const langReplies = replies[lang] || replies.fr;
  if (isGym)   return langReplies.gym;
  if (isFocus) return langReplies.focus;
  if (isParty) return langReplies.party;
  if (isRoad)  return langReplies.road;
  return langReplies.default;
}

// ─── Section principale ───────────────────────────────────────────────────────
export default function EchoSection() {
  const { t } = useTranslation();

  return (
    <section className="echo-section" id="echo">
      <div className="container">

        {/* Header */}
        <div className="section-title" data-anim style={{ textAlign: 'center' }}>
          <div className="section-badge" style={{ justifyContent: 'center' }}>
            <span>🎧</span>
            ECHO
          </div>
          <h2 style={{ textAlign: 'center' }}>
            {t('echo.title_1')}
            <span className="accent-text">{t('echo.title_highlight')}</span>
            {t('echo.title_end')}
          </h2>
          <p style={{ margin: '0 auto', textAlign: 'center' }}>{t('echo.subtitle')}</p>
        </div>

        {/* Grid: phone mock + chat widget */}
        <div className="echo-grid" data-anim>
          {/* Phone mockup gauche */}
          <EchoPhoneMockup />

          {/* Widget interactif droite */}
          <div className="echo-right">
            <div className="echo-right-label" data-anim>
              <span className="section-badge">
                <span>⚡</span>
                {t('echo.try_label')}
              </span>
              <h3 className="echo-right-title">{t('echo.try_title')}</h3>
              <p className="echo-right-sub">{t('echo.try_sub')}</p>
            </div>
            <EchoChatWidget />
            <p className="echo-footer-note">
              {t('echo.footer_note')}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
