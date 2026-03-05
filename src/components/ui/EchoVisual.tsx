import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Track {
  artist: string;
  title: string;
  duration: string;
  color: string;
  artys?: boolean;
}

interface ChatMessage {
  role: 'user' | 'echo';
  text: string;
  tracks?: Track[];
}

// ─── Données de la démo ───────────────────────────────────────────────────────
const DEMO_SEQUENCE: ChatMessage[] = [
  { role: 'user', text: 'ECHO, fais-moi une playlist cardio 🔥 rock/électro' },
  {
    role: 'echo',
    text: "Let's go 💪 Montée progressive — rock indé pour chauffer, électro pour finir fort. Tes artistes de Guilde sont inclus.",
    tracks: [
      { artist: 'Arctic Monkeys', title: 'R U Mine?',        duration: '3:21', color: '#c0392b' },
      { artist: 'Tame Impala',    title: 'Let It Happen',    duration: '7:47', color: '#8e44ad' },
      { artist: 'Artys: Nova K',  title: 'Ignite',           duration: '4:02', color: '#ffef47', artys: true },
      { artist: 'Fred again..',   title: 'Jungle',           duration: '3:59', color: '#1a3a6e' },
      { artist: 'Artys: Mael K',  title: 'Rush Hour',        duration: '3:45', color: '#ffef47', artys: true },
      { artist: 'Justice',        title: 'Genesis',          duration: '3:58', color: '#2c3e50' },
    ],
  },
];

// ─── Particules flottantes ────────────────────────────────────────────────────
function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: `${(i * 5.5) % 100}%`,
        top: `${(i * 7.7) % 100}%`,
        animationDelay: `${(i * 0.35) % 6}s`,
        animationDuration: `${4 + (i % 5)}s`,
        width: `${1 + (i % 2)}px`,
        height: `${1 + (i % 2)}px`,
        opacity: 0.15 + (i % 7) * 0.05,
      })),
    [],
  );

  return (
    <div className="echo-particles" aria-hidden="true">
      {particles.map((style, i) => (
        <div key={i} className="echo-particle" style={style} />
      ))}
    </div>
  );
}

// ─── Waveform animée ─────────────────────────────────────────────────────────
function Waveform({ active }: { active: boolean }) {
  return (
    <div className={`echo-wf${active ? ' echo-wf-active' : ''}`} aria-hidden="true">
      {Array.from({ length: 28 }).map((_, i) => (
        <div
          key={i}
          className="echo-wf-bar"
          style={{ animationDelay: `${i * 0.06}s` }}
        />
      ))}
    </div>
  );
}

// ─── Track item ───────────────────────────────────────────────────────────────
function TrackItem({ track, index }: { track: Track; index: number }) {
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 160);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className={`echo-track${visible ? ' echo-track-visible' : ''}${track.artys ? ' echo-track-artys' : ''}`}
      onMouseEnter={() => setPlaying(true)}
      onMouseLeave={() => setPlaying(false)}
    >
      <div className="echo-track-thumb" style={{ background: track.color }}>
        <Waveform active={playing} />
      </div>
      <div className="echo-track-meta">
        <span className="echo-track-title">{track.title}</span>
        <span className="echo-track-artist">
          {track.artys && <span className="echo-artys-badge">ARTYS</span>}
          {track.artist}
        </span>
      </div>
      <span className="echo-track-dur">{track.duration}</span>
    </div>
  );
}

// ─── Message bulle avec typing ────────────────────────────────────────────────
function EchoMessage({ msg, onDone }: { msg: ChatMessage; onDone: () => void }) {
  const [typed, setTyped] = useState('');
  const [showTracks, setShowTracks] = useState(false);
  const [typing, setTyping] = useState(msg.role === 'echo');

  useEffect(() => {
    if (msg.role === 'user') {
      setTimeout(() => { setTyped(msg.text); onDone(); }, 300);
      return;
    }

    const t1 = setTimeout(() => {
      setTyping(false);
      setTyped(msg.text);
      if (msg.tracks) {
        setTimeout(() => { setShowTracks(true); onDone(); }, 400);
      } else {
        onDone();
      }
    }, 900);
    return () => clearTimeout(t1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`echo-msg echo-msg-${msg.role}`}>
      {msg.role === 'echo' && (
        <div className="echo-msg-avatar">
          <span>🎧</span>
        </div>
      )}
      <div className="echo-msg-body">
        {typing ? (
          <div className="echo-typing-dots">
            <span /><span /><span />
          </div>
        ) : (
          <p className="echo-msg-text">{typed}</p>
        )}
        {showTracks && msg.tracks && (
          <div className="echo-tracklist">
            {msg.tracks.map((tr, i) => (
              <TrackItem key={i} track={tr} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function EchoVisual() {
  const [step, setStep]       = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [running, setRunning]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const playStep = useCallback((i: number) => {
    if (i >= DEMO_SEQUENCE.length) { setRunning(false); return; }
    const delay = i === 0 ? 0 : 600;
    setTimeout(() => {
      setMessages(prev => [...prev, DEMO_SEQUENCE[i]]);
      setStep(i + 1);
    }, delay);
  }, []);

  const startSequence = useCallback(() => {
    setMessages([]);
    setStep(0);
    setRunning(true);
    playStep(0);
  }, [playStep]);

  const handleDone = useCallback(() => {
    setStep(prev => {
      playStep(prev);
      return prev;
    });
  }, [playStep]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, step]);

  useEffect(() => {
    const t = setTimeout(() => startSequence(), 800);
    return () => clearTimeout(t);
  }, [startSequence]);

  return (
    <div className="echo-visual">
      {/* Halo de fond */}
      <div className="echo-visual-glow" aria-hidden="true" />
      <div className="echo-visual-glow2" aria-hidden="true" />

      {/* Particles */}
      <Particles />

      {/* Scanlines */}
      <div className="echo-scanlines" aria-hidden="true" />

      {/* Terminal */}
      <div className="echo-terminal">

        {/* Header */}
        <div className="echo-terminal-header">
          <div className="echo-terminal-dots" aria-hidden="true">
            <span className="echo-dot echo-dot-red" />
            <span className="echo-dot echo-dot-yellow" />
            <span className="echo-dot echo-dot-green" />
          </div>
          <div className="echo-terminal-title">
            <div className="echo-status-dot" aria-hidden="true" />
            <span>ECHO — Assistant Musical</span>
          </div>
          <div className="echo-terminal-actions" aria-hidden="true">
            <span className="echo-terminal-tag">IA</span>
          </div>
        </div>

        {/* Messages */}
        <div className="echo-terminal-body">
          {messages.map((msg, i) => (
            <EchoMessage
              key={i}
              msg={msg}
              onDone={i === messages.length - 1 ? handleDone : () => {}}
            />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Footer input factice */}
        <div className="echo-terminal-footer">
          <div className="echo-input-bar">
            <div className={`echo-mic-pulse${running ? ' active' : ''}`} aria-hidden="true">
              <span>🎙</span>
            </div>
            <span className="echo-input-placeholder">
              {running ? 'ECHO compose ta playlist...' : 'Dis à ECHO ce que tu veux écouter...'}
            </span>
            <button
              className="echo-replay-btn"
              onClick={startSequence}
              aria-label="Rejouer la démo"
              title="Rejouer"
            >
              ↺
            </button>
          </div>
          <p className="echo-terminal-note">
            🌱 Chaque écoute rémunère directement les artistes
          </p>
        </div>

      </div>
    </div>
  );
}
