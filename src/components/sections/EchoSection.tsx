import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant';
  content: string;
  tracks?: Track[];
}

interface Track {
  artist: string;
  title: string;
  duration: string;
  color: string;
  artys?: boolean;
}

// ─── System prompt ECHO ───────────────────────────────────────────────────────
export const ECHO_SYSTEM_PROMPT = `Tu es ECHO, l'assistant musical d'Artys.`;

// ─── Données demo ─────────────────────────────────────────────────────────────
const DEMO_MESSAGES: Message[] = [
  { role: 'user', content: 'Fais-moi une playlist cardio 🔥 rock/électro' },
  {
    role: 'assistant',
    content: "Let's go 💪 Montée progressive — rock pour chauffer, électro pour finir fort. Tes artistes Artys inclus 🔥",
    tracks: [
      { artist: 'Arctic Monkeys', title: 'R U Mine?',     duration: '3:21', color: '#c0392b' },
      { artist: 'Tame Impala',    title: 'Let It Happen', duration: '7:47', color: '#8e44ad' },
      { artist: 'Artys: Nova K',  title: 'Ignite',        duration: '4:02', color: '#00E5B0', artys: true },
      { artist: 'Fred again..',   title: 'Jungle',        duration: '3:59', color: '#1a3a6e' },
      { artist: 'Artys: Mael K',  title: 'Rush Hour',     duration: '3:45', color: '#00E5B0', artys: true },
      { artist: 'Justice',        title: 'Genesis',       duration: '3:58', color: '#2c3e50' },
    ],
  },
];

// ─── Suggestions par langue ───────────────────────────────────────────────────
const SUGGESTIONS: Record<string, string[]> = {
  fr: ['Playlist cardio 🏋️', 'Focus & concentration 🧠', 'Vendredi soir 🎉', 'Road trip ☀️'],
  en: ['Gym playlist 🏋️', 'Focus & work 🧠', 'Friday night 🎉', 'Road trip ☀️'],
  es: ['Playlist cardio 🏋️', 'Concentración 🧠', 'Viernes noche 🎉', 'Viaje en coche ☀️'],
};

// ─── Fallback replies ─────────────────────────────────────────────────────────
function getFallback(text: string, lang: string): { content: string; tracks?: Track[] } {
  const l = text.toLowerCase();
  const isGym   = l.includes('cardio') || l.includes('gym') || l.includes('sport') || l.includes('salle');
  const isFocus = l.includes('focus') || l.includes('concentr') || l.includes('travail') || l.includes('work');
  const isParty = l.includes('fête') || l.includes('party') || l.includes('vendredi') || l.includes('friday') || l.includes('soir');
  const isRoad  = l.includes('road') || l.includes('voiture') || l.includes('car') || l.includes('trip');

  const replies: Record<string, Record<string, { content: string; tracks: Track[] }>> = {
    fr: {
      gym:   { content: "Let's go 💪 Cardio Power activée — rock + électro montée progressive.", tracks: [
        { artist: 'Peggy Gou',     title: 'Sings Boys',      duration: '3:32', color: '#8B4513' },
        { artist: 'Fred again..',  title: 'Jungle',          duration: '3:59', color: '#1a3a6e' },
        { artist: 'Artys: Nova K', title: 'Ignite',          duration: '4:02', color: '#00E5B0', artys: true },
        { artist: 'Bicep',         title: 'Glue',            duration: '5:02', color: '#2c3e50' },
        { artist: 'Artys: Mael K', title: 'Rush Hour',       duration: '3:45', color: '#00E5B0', artys: true },
      ]},
      focus: { content: "Concentration mode 🎧 Entre dans la zone — ambient + post-rock.", tracks: [
        { artist: 'Bonobo',        title: 'Kong',            duration: '5:45', color: '#1a4a3a' },
        { artist: 'Nils Frahm',    title: 'Says',            duration: '8:12', color: '#2a2a4a' },
        { artist: 'Artys: Luna W', title: 'Deep Space',      duration: '6:30', color: '#00E5B0', artys: true },
        { artist: 'Jon Hopkins',   title: 'Open Eye Signal', duration: '10:06', color: '#1a3a2a' },
      ]},
      party: { content: "Ambiance fête 🎉 On monte le volume !", tracks: [
        { artist: 'Daft Punk',     title: 'Harder Better…',  duration: '3:45', color: '#2a2a5a' },
        { artist: 'Justice',       title: 'D.A.N.C.E.',      duration: '3:40', color: '#4a2a1a' },
        { artist: 'Artys: DJ K',   title: 'Neon Rush',       duration: '4:10', color: '#00E5B0', artys: true },
        { artist: 'Calvin Harris', title: 'Summer',          duration: '3:34', color: '#1a3a5a' },
      ]},
      road:  { content: "Road trip en vue 🚗 La route t'appartient ✨", tracks: [
        { artist: 'Arctic Monkeys', title: 'R U Mine?',      duration: '3:21', color: '#c0392b' },
        { artist: 'Tame Impala',    title: 'Let It Happen',  duration: '7:47', color: '#8e44ad' },
        { artist: 'Artys: Blue C',  title: 'Open Highway',   duration: '4:22', color: '#00E5B0', artys: true },
        { artist: 'Fleetwood Mac',  title: 'The Chain',      duration: '4:30', color: '#2a4a1a' },
      ]},
      default: { content: "Super choix 🎵 Voici un mix varié pour toi !", tracks: [
        { artist: 'Artys: Nova S',  title: 'Horizon',        duration: '4:12', color: '#00E5B0', artys: true },
        { artist: 'Stromae',        title: 'Papaoutai',      duration: '4:00', color: '#1a2a4a' },
        { artist: 'The Weeknd',     title: 'Blinding Lights', duration: '3:20', color: '#4a1a1a' },
        { artist: 'Artys: Mael K',  title: 'Midnight Run',   duration: '3:45', color: '#00E5B0', artys: true },
      ]},
    },
    en: {
      gym:   { content: "Let's go 💪 Cardio Power playlist — progressive build rock + electro.", tracks: [
        { artist: 'Peggy Gou',     title: 'Sings Boys',      duration: '3:32', color: '#8B4513' },
        { artist: 'Fred again..',  title: 'Jungle',          duration: '3:59', color: '#1a3a6e' },
        { artist: 'Artys: Nova K', title: 'Ignite',          duration: '4:02', color: '#00E5B0', artys: true },
        { artist: 'Bicep',         title: 'Glue',            duration: '5:02', color: '#2c3e50' },
      ]},
      focus: { content: "Focus mode on 🎧 Enter the zone — ambient vibes.", tracks: [
        { artist: 'Bonobo',        title: 'Kong',            duration: '5:45', color: '#1a4a3a' },
        { artist: 'Artys: Luna W', title: 'Deep Space',      duration: '6:30', color: '#00E5B0', artys: true },
        { artist: 'Jon Hopkins',   title: 'Open Eye Signal', duration: '10:06', color: '#1a3a2a' },
      ]},
      party: { content: "Party vibes 🎉 Let's turn it up!", tracks: [
        { artist: 'Daft Punk',     title: 'Harder Better…',  duration: '3:45', color: '#2a2a5a' },
        { artist: 'Artys: DJ K',   title: 'Neon Rush',       duration: '4:10', color: '#00E5B0', artys: true },
        { artist: 'Calvin Harris', title: 'Summer',          duration: '3:34', color: '#1a3a5a' },
      ]},
      road:  { content: "Road trip time 🚗 Own the road ✨", tracks: [
        { artist: 'Arctic Monkeys', title: 'R U Mine?',      duration: '3:21', color: '#c0392b' },
        { artist: 'Artys: Blue C',  title: 'Open Highway',   duration: '4:22', color: '#00E5B0', artys: true },
        { artist: 'Tame Impala',    title: 'Let It Happen',  duration: '7:47', color: '#8e44ad' },
      ]},
      default: { content: "Great taste 🎵 Here's your mix!", tracks: [
        { artist: 'Artys: Nova S',  title: 'Horizon',        duration: '4:12', color: '#00E5B0', artys: true },
        { artist: 'The Weeknd',     title: 'Blinding Lights', duration: '3:20', color: '#4a1a1a' },
        { artist: 'Artys: Mael K',  title: 'Midnight Run',   duration: '3:45', color: '#00E5B0', artys: true },
      ]},
    },
    es: {
      gym:   { content: "Let's go 💪 Playlist Cardio Power — rock + electro progresivo.", tracks: [
        { artist: 'Peggy Gou',     title: 'Sings Boys',      duration: '3:32', color: '#8B4513' },
        { artist: 'Artys: Nova K', title: 'Ignite',          duration: '4:02', color: '#00E5B0', artys: true },
        { artist: 'Fred again..',  title: 'Jungle',          duration: '3:59', color: '#1a3a6e' },
      ]},
      focus: { content: "Modo concentración 🎧 Entra en la zona.", tracks: [
        { artist: 'Bonobo',        title: 'Kong',            duration: '5:45', color: '#1a4a3a' },
        { artist: 'Artys: Luna W', title: 'Deep Space',      duration: '6:30', color: '#00E5B0', artys: true },
      ]},
      party: { content: "Ambiente fiesta 🎉 ¡A subir el volumen!", tracks: [
        { artist: 'Daft Punk',     title: 'Harder Better…',  duration: '3:45', color: '#2a2a5a' },
        { artist: 'Artys: DJ K',   title: 'Neon Rush',       duration: '4:10', color: '#00E5B0', artys: true },
      ]},
      road:  { content: "Road trip 🚗 La carretera es tuya ✨", tracks: [
        { artist: 'Arctic Monkeys', title: 'R U Mine?',      duration: '3:21', color: '#c0392b' },
        { artist: 'Artys: Blue C',  title: 'Open Highway',   duration: '4:22', color: '#00E5B0', artys: true },
      ]},
      default: { content: "Gran elección 🎵 Tu mix personalizado:", tracks: [
        { artist: 'Artys: Nova S',  title: 'Horizon',        duration: '4:12', color: '#00E5B0', artys: true },
        { artist: 'The Weeknd',     title: 'Blinding Lights', duration: '3:20', color: '#4a1a1a' },
      ]},
    },
  };

  const r = replies[lang] || replies.fr;
  if (isGym)   return r.gym;
  if (isFocus) return r.focus;
  if (isParty) return r.party;
  if (isRoad)  return r.road;
  return r.default;
}

// ─── Waveform mini ────────────────────────────────────────────────────────────
function Waveform({ active }: { active: boolean }) {
  return (
    <div className={`ev-wf${active ? ' ev-wf-on' : ''}`} aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="ev-wf-bar" style={{ animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  );
}

// ─── Track item ───────────────────────────────────────────────────────────────
function TrackRow({ track, index }: { track: Track; index: number }) {
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 140 + 200);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className={`ev-track${visible ? ' ev-track-in' : ''}${track.artys ? ' ev-track-artys' : ''}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="ev-track-thumb" style={{ background: track.color }}>
        <Waveform active={hover} />
      </div>
      <div className="ev-track-meta">
        <span className="ev-track-title">{track.title}</span>
        <span className="ev-track-artist">
          {track.artys && <span className="ev-artys-badge">ARTYS</span>}
          {track.artist}
        </span>
      </div>
      <span className="ev-track-dur">{track.duration}</span>
    </div>
  );
}

// ─── Typing dots ──────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="ev-typing">
      {[0, 1, 2].map(i => (
        <div key={i} className="ev-typing-dot" style={{ animationDelay: `${i * 0.22}s` }} />
      ))}
    </div>
  );
}

// ─── Bulle de message ─────────────────────────────────────────────────────────
function MessageBubble({ msg, onDone, isLast }: { msg: Message; onDone: () => void; isLast: boolean }) {
  const [showContent, setShowContent] = useState(msg.role === 'user');
  const [showTracks,  setShowTracks]  = useState(false);
  const [typing,      setTyping]      = useState(msg.role === 'assistant');

  useEffect(() => {
    if (msg.role === 'user') { setTimeout(() => onDone(), 200); return; }
    const t1 = setTimeout(() => {
      setTyping(false);
      setShowContent(true);
      if (msg.tracks?.length) {
        setTimeout(() => { setShowTracks(true); if (isLast) onDone(); }, 350);
      } else {
        if (isLast) onDone();
      }
    }, 900);
    return () => clearTimeout(t1);
  }, []);

  return (
    <div className={`ev-msg ev-msg-${msg.role}`}>
      {msg.role === 'assistant' && (
        <div className="ev-avatar" aria-hidden="true">🎧</div>
      )}
      <div className="ev-bubble">
        {typing ? <TypingDots /> : (
          showContent && <p className="ev-bubble-text">{msg.content}</p>
        )}
        {showTracks && msg.tracks && (
          <div className="ev-tracklist">
            {msg.tracks.map((tr, i) => <TrackRow key={i} track={tr} index={i} />)}
          </div>
        )}
      </div>
      {msg.role === 'user' && (
        <div className="ev-user-avatar" aria-hidden="true">
          <div className="ev-user-dot" />
        </div>
      )}
    </div>
  );
}

// ─── Le grand terminal ECHO ───────────────────────────────────────────────────
function EchoTerminal() {
  const { i18n } = useTranslation();
  const lang = i18n.language.slice(0, 2);

  const welcomeByLang: Record<string, string> = {
    fr: 'Salut 👋 Je suis ECHO, ton assistant musical Artys. Dis-moi ce que tu veux écouter — une humeur, une activité, un genre — et je compose ta playlist en quelques secondes. 🎧',
    en: 'Hey 👋 I\'m ECHO, your Artys music assistant. Tell me what you want to listen to — a mood, activity, or genre — and I\'ll build your playlist in seconds. 🎧',
    es: 'Hola 👋 Soy ECHO, tu asistente musical Artys. Dime qué quieres escuchar y creo tu playlist en segundos. 🎧',
  };

  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: welcomeByLang[lang] || welcomeByLang.fr },
  ]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [_step,   setStep]    = useState(0);
  const [_demo,   setDemo]    = useState(false);
  const [apiError, setApiError] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: welcomeByLang[lang] || welcomeByLang.fr }]);
    setStep(0); setDemo(false);
  }, [lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  const playDemoStep = (i: number) => {
    if (i >= DEMO_MESSAGES.length) return;
    setTimeout(() => {
      setMessages(prev => [...prev, DEMO_MESSAGES[i]]);
      setStep(i + 1);
    }, i === 0 ? 0 : 500);
  };

  const handleDone = (i: number) => {
    if (i < DEMO_MESSAGES.length - 1) playDemoStep(i + 1);
  };

  const sendMessage = async (text?: string) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');
    setLoading(true);
    setApiError(false);
    const userMsg: Message = { role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/echo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })), lang }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch {
      const fallback = getFallback(userText, lang);
      setMessages(prev => [...prev, { role: 'assistant', content: fallback.content, tracks: fallback.tracks }]);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = SUGGESTIONS[lang] || SUGGESTIONS.fr;
  const isOnlyWelcome = messages.length === 1;

  return (
    <div className="ev-terminal">
      {/* Halos */}
      <div className="ev-glow ev-glow-1" aria-hidden="true" />
      <div className="ev-glow ev-glow-2" aria-hidden="true" />

      {/* Particles */}
      <div className="ev-particles" aria-hidden="true">
        {Array.from({ length: 22 }).map((_, i) => (
          <div key={i} className="ev-particle" style={{
            left: `${(i * 4.5) % 100}%`,
            top:  `${(i * 7.3) % 100}%`,
            animationDelay:    `${(i * 0.4) % 7}s`,
            animationDuration: `${5 + (i % 4)}s`,
            width:  `${1 + (i % 2)}px`,
            height: `${1 + (i % 2)}px`,
            opacity: 0.1 + (i % 5) * 0.05,
          }} />
        ))}
      </div>

      {/* Scanlines subtiles */}
      <div className="ev-scanlines" aria-hidden="true" />

      {/* Header terminal */}
      <div className="ev-header">
        <div className="ev-dots" aria-hidden="true">
          <span className="ev-dot" style={{ background: '#ff5f57' }} />
          <span className="ev-dot" style={{ background: '#febc2e' }} />
          <span className="ev-dot" style={{ background: '#28c840' }} />
        </div>
        <div className="ev-header-title">
          <div className="ev-status-dot" aria-hidden="true" />
          <span>ECHO — Assistant Musical IA</span>
        </div>
        <div className="ev-header-badge">IA</div>
      </div>

      {/* Corps messages */}
      <div className="ev-body">
        {messages.map((msg, i) => (
          <MessageBubble
            key={`${i}-${msg.content.slice(0, 10)}`}
            msg={msg}
            isLast={i === messages.length - 1}
            onDone={() => handleDone(i)}
          />
        ))}
        {loading && (
          <div className="ev-msg ev-msg-assistant">
            <div className="ev-avatar" aria-hidden="true">🎧</div>
            <div className="ev-bubble"><TypingDots /></div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {isOnlyWelcome && !loading && (
        <div className="ev-suggestions">
          {suggestions.map((s, i) => (
            <button key={i} className="ev-suggestion" onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="ev-footer">
        <div className="ev-input-row">
          <div className={`ev-mic${loading ? ' ev-mic-active' : ''}`} aria-hidden="true">🎙</div>
          <input
            type="text"
            className="ev-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
            placeholder={
              lang === 'en' ? 'Tell ECHO what you want to listen to...' :
              lang === 'es' ? 'Dile a ECHO qué quieres escuchar...' :
              'Dis à ECHO ce que tu veux écouter...'
            }
            disabled={loading}
          />
          <button
            className={`ev-send${input.trim() && !loading ? ' ev-send-active' : ''}`}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            aria-label="Envoyer"
          >
            {loading ? <span className="ev-spinner" /> : '↑'}
          </button>
        </div>
        <p className="ev-footer-note">
          🌱 Chaque écoute rémunère directement les artistes · Mode démo sans clé API
        </p>
        {apiError && (
          <p style={{ fontSize: '10px', color: 'var(--text-secondary)', textAlign: 'center', opacity: 0.4, marginTop: '4px' }}>
            Mode démo actif — connecte ton API key pour activer ECHO en temps réel
          </p>
        )}
      </div>
    </div>
  );
}

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

        {/* Terminal pleine largeur */}
        <div className="echo-terminal-wrap" data-anim>
          <EchoTerminal />
        </div>

        {/* 3 pilliers sous le terminal */}
        <div className="echo-pillars" data-anim>
          <div className="echo-pillar">
            <span className="echo-pillar-icon">🎵</span>
            <strong>{t('echo.pillar_1_title') || 'Playlists instantanées'}</strong>
            <p>{t('echo.pillar_1_desc') || 'Une humeur, une activité — ECHO compose en secondes.'}</p>
          </div>
          <div className="echo-pillar">
            <span className="echo-pillar-icon">💸</span>
            <strong>{t('echo.pillar_2_title') || 'Tes écoutes rémunèrent'}</strong>
            <p>{t('echo.pillar_2_desc') || 'Chaque stream va directement aux artistes que tu soutiens.'}</p>
          </div>
          <div className="echo-pillar">
            <span className="echo-pillar-icon">🔗</span>
            <strong>{t('echo.pillar_3_title') || 'Artistes de ta Guilde'}</strong>
            <p>{t('echo.pillar_3_desc') || 'ECHO intègre en priorité les artistes de ton Backstage.'}</p>
          </div>
        </div>

      </div>
    </section>
  );
}
