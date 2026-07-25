import React from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { Clock } from 'lucide-react';

export const Timer: React.FC = () => {
  const { formatTime, timeRemaining } = useCountdown();

  return (
    <div className={`flex items-center gap-3 px-4 py-2 border font-mono rounded-lg transition-colors duration-500 ${
      timeRemaining < 300 
        ? 'bg-rose-950/40 border-rose-500 text-rose-400 animate-pulse' 
        : 'bg-slate-900/90 border-slate-800 text-emerald-400'
    }`}>
      <Clock size={16} className={timeRemaining < 300 ? 'text-rose-400' : 'text-emerald-400'} />
      <span className="text-xs uppercase tracking-wider text-slate-400">Time Remaining:</span>
      <span className="text-base font-black tabular-nums">{formatTime()}</span>
    </div>
  );
};