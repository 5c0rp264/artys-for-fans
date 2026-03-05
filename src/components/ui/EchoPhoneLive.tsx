import { useState, useEffect } from 'react';

// ─── Scénario de démo automatique ────────────────────────────────────────────
const SCENARIO = [
  {
    userMsg: 'Playlist cardio 🔥 rock / électro',
    echoReply: "Let's go 💪 Montée progressive — rock pour chauffer, électro pour finir fort.",
    tracks: [
      { title: 'R U Mine?',     artist: 'Arctic Monkeys', dur: '3:21', color: '#c0392b', emoji: '🎸' },
      { title: 'Let It Happen', artist: 'Tame Impala',    dur: '7:47', color: '#8e44ad', emoji: '🌀' },
      { title: 'Ignite',        artist: 'Nova K ✦',       dur: '4:02', color: '#ffef47', emoji: '⚡', artys: true },
      { title: 'Jungle',        artist: 'Fred again..',   dur: '3:59', color: '#1a6eb5', emoji: '🌿' },
      { title: 'Rush Hour',     artist: 'Mael K ✦',       dur: '3:45', color: '#ffef47', emoji: '🚀', artys: true },
    ],
  },
  {
    userMsg: 'Focus & concentration 🧠',
    echoReply: 'Mode concentration activé 🎯 Sons profonds pour rester dans la zone.',
    tracks: [
      { title: 'Experience',    artist: 'Ludovico E.',    dur: '5:14', color: '#2ecc71', emoji: '🎹' },
      { title: 'Comptine',      artist: 'Yann Tiersen',  dur: '2:28', color: '#3498db', emoji: '🎼' },
      { title: 'Deep Space',    artist: 'Luna W ✦',       dur: '6:30', color: '#ffef47', emoji: '🌙', artys: true },
      { title: 'Intro',         artist: 'The xx',         dur: '2:07', color: '#555',    emoji: '✨' },
    ],
  },
];

type Track = { title: string; artist: string; dur: string; color: string; emoji: string; artys?: boolean };

// ─── Waveform animée ──────────────────────────────────────────────────────────
function Waveform() {
  return (
    <div className="epl-waveform">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="epl-waveform-bar"
          style={{ animationDelay: `${(i * 0.08).toFixed(2)}s` }}
        />
      ))}
    </div>
  );
}

// ─── Orb ECHO pulsante ────────────────────────────────────────────────────────
function EchoOrb({ listening }: { listening: boolean }) {
  return (
    <div className={`epl-orb-wrap${listening ? ' epl-orb-listening' : ''}`}>
      <div className="epl-orb-ring epl-orb-ring-3" />
      <div className="epl-orb-ring epl-orb-ring-2" />
      <div className="epl-orb-ring epl-orb-ring-1" />
      <div className="epl-orb">
        <span className="epl-orb-label">ECHO</span>
      </div>
    </div>
  );
}

// ─── Track dans la playlist ───────────────────────────────────────────────────
function TrackRow({ track, index, visible, active }: { track: Track; index: number; visible: boolean; active: boolean }) {
  return (
    <div
      className={`epl-track${visible ? ' epl-track-in' : ''}${active ? ' epl-track-active' : ''}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <div className="epl-track-cover" style={{ background: track.artys ? 'rgba(255,239,71,0.15)' : `${track.color}22`, borderColor: track.artys ? '#ffef47' : track.color }}>
        <span>{track.emoji}</span>
      </div>
      <div className="epl-track-info">
        <div className="epl-track-title">{track.title}</div>
        <div className={`epl-track-artist${track.artys ? ' epl-track-artys' : ''}`}>{track.artist}</div>
      </div>
      <div className="epl-track-dur">{track.dur}</div>
      {active && <div className="epl-track-playing"><Waveform /></div>}
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function EchoPhoneLive() {
  const [phase, setPhase]           = useState<'idle'|'typing'|'thinking'|'playlist'|'playing'>('idle');
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [typedText, setTypedText]   = useState('');
  const [tracksVisible, setTracksVisible] = useState(false);
  const [activeTrack, setActiveTrack]     = useState(0);
  const [dots, setDots]             = useState('');

  const scenario = SCENARIO[scenarioIdx];

  // Effet de frappe lettre par lettre
  useEffect(() => {
    if (phase !== 'typing') return;
    const msg = scenario.userMsg;
    let i = 0;
    setTypedText('');
    const interval = setInterval(() => {
      i++;
      setTypedText(msg.slice(0, i));
      if (i >= msg.length) {
        clearInterval(interval);
        setTimeout(() => setPhase('thinking'), 400);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [phase, scenarioIdx]);

  // Points de réflexion
  useEffect(() => {
    if (phase !== 'thinking') return;
    let n = 0;
    const interval = setInterval(() => {
      n++;
      setDots('.'.repeat((n % 3) + 1));
    }, 400);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setPhase('playlist');
    }, 2000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [phase]);

  // Apparition des tracks puis lecture
  useEffect(() => {
    if (phase !== 'playlist') return;
    setTracksVisible(false);
    setActiveTrack(0);
    setTimeout(() => {
      setTracksVisible(true);
      setTimeout(() => setPhase('playing'), 1200);
    }, 300);
  }, [phase]);

  // Défilement des tracks actives
  useEffect(() => {
    if (phase !== 'playing') return;
    const tracks = scenario.tracks;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % tracks.length;
      setActiveTrack(idx);
    }, 2200);
    // Passe au scénario suivant après avoir parcouru toutes les tracks
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setTracksVisible(false);
      setTypedText('');
      setTimeout(() => {
        setScenarioIdx(prev => (prev + 1) % SCENARIO.length);
        setPhase('typing');
      }, 600);
    }, tracks.length * 2200 + 800);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [phase, scenarioIdx]);

  // Démarrage initial
  useEffect(() => {
    const t = setTimeout(() => setPhase('typing'), 800);
    return () => clearTimeout(t);
  }, []);

  const listening = phase === 'typing';
  const thinking  = phase === 'thinking';
  const hasPlaylist = phase === 'playlist' || phase === 'playing';

  return (
    <div className="epl-phone-outer">
      <div className="epl-phone">
        {/* Notch */}
        <div className="epl-notch" />

        {/* Écran */}
        <div className="epl-screen">

          {/* Header */}
          <div className="epl-header">
            <span className="epl-header-logo">ARTYS</span>
            <span className="epl-header-dot" />
          </div>

          {/* Orb centrale */}
          <EchoOrb listening={listening} />

          {/* Bulle utilisateur */}
          <div className={`epl-bubble-wrap epl-bubble-user${typedText ? ' epl-bubble-in' : ''}`}>
            <div className="epl-bubble epl-bubble-user-inner">
              {typedText || '\u00a0'}
              {listening && <span className="epl-cursor">|</span>}
            </div>
          </div>

          {/* Réponse ECHO */}
          {(thinking || hasPlaylist) && (
            <div className="epl-bubble-wrap epl-bubble-echo-wrap epl-bubble-in">
              <div className="epl-bubble epl-bubble-echo-inner">
                {thinking ? (
                  <span className="epl-thinking">ECHO réfléchit{dots}</span>
                ) : (
                  scenario.echoReply
                )}
              </div>
            </div>
          )}

          {/* Playlist */}
          <div className="epl-playlist">
            {hasPlaylist && (
              <div className="epl-playlist-label">
                ✦ Playlist générée par ECHO
              </div>
            )}
            {scenario.tracks.map((track, i) => (
              <TrackRow
                key={`${scenarioIdx}-${i}`}
                track={track}
                index={i}
                visible={tracksVisible}
                active={phase === 'playing' && activeTrack === i}
              />
            ))}
          </div>

          {/* Player bas */}
          {phase === 'playing' && (
            <div className="epl-player epl-player-in">
              <div className="epl-player-info">
                <span className="epl-player-emoji">{scenario.tracks[activeTrack]?.emoji}</span>
                <div>
                  <div className="epl-player-title">{scenario.tracks[activeTrack]?.title}</div>
                  <div className={`epl-player-artist${scenario.tracks[activeTrack]?.artys ? ' epl-track-artys' : ''}`}>
                    {scenario.tracks[activeTrack]?.artist}
                  </div>
                </div>
              </div>
              <div className="epl-player-bar">
                <div className="epl-player-progress" />
              </div>
              <div className="epl-player-controls">
                <span>⏮</span>
                <div className="epl-play-btn">▶</div>
                <span>⏭</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Glow ambiance sous le phone */}
      <div className="epl-glow" />
    </div>
  );
}
