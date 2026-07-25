import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Trophy, ArrowLeft } from 'lucide-react';

export const Leaderboard: React.FC<{ onBackToArena?: () => void }> = ({ onBackToArena }) => {
  const fetchInitialState = useStore((state) => state.fetchInitialState);
  const leaderboard = useStore((state) => state.leaderboard);

  useEffect(() => {
    const apiTarget = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    fetchInitialState(apiTarget);
    const poller = setInterval(() => fetchInitialState(apiTarget), 15000); // Failover fallback poller
    return () => clearInterval(poller);
  }, [fetchInitialState]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg">
              <Trophy size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold uppercase tracking-widest text-slate-100">GLOBAL TRANSMISSION STANDINGS</h1>
              <p className="text-[10px] text-slate-500 mt-0.5">Real-time aggregate scoring snapshot index across active networks.</p>
            </div>
          </div>

          {onBackToArena && (
            <button
              onClick={onBackToArena}
              className="flex items-center gap-2 border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs px-3 py-1.5 rounded transition-all text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft size={14} />
              <span>RETURN TO ARENA</span>
            </button>
          )}
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 bg-black/40 border-b border-slate-800 px-4 py-3 text-[10px] font-bold text-slate-500 tracking-wider uppercase">
            <div className="col-span-2">RANK</div>
            <div className="col-span-7">CREW DECK IDENTIFIER</div>
            <div className="col-span-3 text-right">SCORE MATRIX VALUE</div>
          </div>

          <div className="divide-y divide-slate-900">
            {leaderboard.map((team, idx) => (
              <div key={team.id} className="grid grid-cols-12 px-4 py-4 items-center hover:bg-slate-900/20 transition-colors">
                <div className="col-span-2 font-sans font-black text-sm text-slate-500">
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                </div>
                <div className="col-span-7 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: team.color }} />
                  <span className="text-xs font-bold tracking-wide text-slate-300 uppercase">{team.name}</span>
                </div>
                <div className="col-span-3 text-right text-xs font-black text-emerald-400 tabular-nums">
                  {team.totalScore} <span className="text-[9px] text-slate-600 font-normal">PTS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};