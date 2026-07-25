import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Terminal, ShieldCheck, AlertCircle } from 'lucide-react';

interface FlagSubmitProps {
  activePlanetId: string;
}

const PLANET_CHALLENGE_IDS: Record<string, number> = {
  'krypton': 1,
  'phantom': 2,
  'oracle': 3,
  'nebula': 4,
  'axiom': 5,
  'void-core': 6,
  'the-summit': 7,
}

export const FlagSubmit: React.FC<FlagSubmitProps> = ({ activePlanetId }) => {
  const currentTeamId = useStore((state) => state.currentTeamId);
  const planets = useStore((state) => state.planets);
  const [flag, setFlag] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });
  const [loading, setLoading] = useState(false);

  const activePlanet = planets[activePlanetId];

  const submitPayload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag || !currentTeamId || !activePlanetId) return;

    setLoading(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/flags/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: currentTeamId,
          challengeId: PLANET_CHALLENGE_IDS[activePlanetId],
          planetId: activePlanetId,
          flag: flag.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.correct) {
        setStatus({
          type: 'success',
          message: `Flag accepted! Successfully bypassed node infrastructure. +${data.pointsAwarded} PTS allocated.`,
        });
        setFlag('');
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'Signature rejected. Verification failure.',
        });
      }
    } catch {
      setStatus({ type: 'error', message: 'Transmission drop. Core network pipeline error.' });
    } finally {
      setLoading(false);
    }
  };

  if (!activePlanetId) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 text-center font-mono text-xs text-slate-500">
        Select an active system node array from the interactive map layer above to mount exploits.
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono shadow-xl">
      <div className="flex items-center gap-2 text-slate-300 text-xs uppercase tracking-wider border-b border-slate-800 pb-3 mb-4">
        <Terminal size={14} className="text-emerald-400" />
        <span>Submitting To: <span className="text-sky-400 font-bold font-sans">{activePlanet.name}</span></span>
      </div>

      <form onSubmit={submitPayload} className="space-y-3">
        <input
          type="text"
          value={flag}
          onChange={(e) => setFlag(e.target.value)}
          placeholder="ZEROSIG{signal_hash_sequence}"
          disabled={loading}
          className="w-full bg-black/50 border border-slate-700/80 rounded px-3 py-2.5 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono transition-colors tracking-wide placeholder-slate-600"
        />
        <button
          type="submit"
          disabled={loading || !flag}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-slate-100 text-xs font-bold py-2.5 rounded tracking-widest uppercase transition-all duration-200"
        >
          {loading ? 'TRANSMITTING...' : 'INJECT FLAG'}
        </button>
      </form>

      {status.type !== 'idle' && (
        <div className={`mt-4 flex items-start gap-2.5 p-3 rounded text-xs border ${
          status.type === 'success' 
            ? 'bg-emerald-950/30 border-emerald-800 text-emerald-400' 
            : 'bg-rose-950/30 border-rose-900/60 text-rose-400'
        }`}>
          {status.type === 'success' ? <ShieldCheck size={16} className="flex-shrink-0 mt-0.5" /> : <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />}
          <span>{status.message}</span>
        </div>
      )}
    </div>
  );
};