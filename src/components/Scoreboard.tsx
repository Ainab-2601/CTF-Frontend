import React from 'react';
import { useStore } from '../store/useStore';
import { Trophy } from 'lucide-react';

export const Scoreboard: React.FC = () => {
  const leaderboard = useStore((state) => state.leaderboard);
  const currentTeamId = useStore((state) => state.currentTeamId);

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-5 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 font-mono text-xs text-slate-300 uppercase tracking-widest border-b border-slate-800 pb-3 mb-4">
        <Trophy size={14} className="text-amber-500" />
        <span>Telemetry Matrix Leaderboard</span>
      </div>

      <div className="space-y-2 font-mono">
        {leaderboard.length === 0 ? (
          <div className="text-center text-xs text-slate-600 py-4">Awaiting execution data lines...</div>
        ) : (
          leaderboard.map((team, index) => {
            const isSelf = team.id === currentTeamId
            return (
              <div
                key={team.id}
                className={`flex justify-between items-center px-3 py-2.5 rounded transition-all duration-300 border ${
                  team.eliminated
                    ? 'bg-rose-950/10 border-rose-900/30 opacity-50'
                    : isSelf
                    ? 'bg-emerald-950/20 border-emerald-500/40 shadow-inner'
                    : 'bg-black/30 border-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate max-w-[70%]">
                  <span className="text-[10px] text-slate-500 font-bold w-4">#{index + 1}</span>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: team.color }} />
                  <span className={`text-xs truncate ${
                    team.eliminated ? 'text-rose-500 line-through' : isSelf ? 'text-emerald-400 font-bold' : 'text-slate-300'
                  }`}>
                    {team.name} {isSelf && '(YOU)'}
                  </span>
                  {team.eliminated && (
                    <span className="text-[9px] text-rose-500 border border-rose-900 px-1 rounded">ELIMINATED</span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-400 tabular-nums">
                  {team.eliminated ? '💀' : `${team.totalScore}`} <span className="text-[10px] text-slate-600">PTS</span>
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
};