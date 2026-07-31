import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ShieldAlert, Cpu } from 'lucide-react';

export const Lobby: React.FC<{ onAuthSuccess: () => void }> = ({ onAuthSuccess }) => {
  const [leadName, setLeadName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamColor, setTeamColor] = useState('#22c55e');
  const [error, setError] = useState('');
  const setCurrentTeam = useStore((state) => state.setCurrentTeam);

  const joinSession = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName.trim() || !leadName.trim()) return

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teams/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName.trim(), color: teamColor, leadName: leadName.trim() }),
      })
      const data = await res.json()

      if (res.ok && data.id) {
        if (data.eliminated) {
          setError('☠️ Tumhari team eliminate ho gayi hai. Arena access band hai.')
          return
        }
        setCurrentTeam(data.id)
        onAuthSuccess()
      } else {
        setError(data.message || 'Verification failed.')
      }
    } catch {
      setError('Connection failure communicating with infrastructure servers.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-emerald-500/20">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 font-mono shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-emerald-950/50 border border-emerald-800/60 rounded-xl mb-3 text-emerald-400">
            <Cpu size={24} className="animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <h1 className="text-lg font-black tracking-widest text-slate-200 uppercase">CREW SYSTEM ACCESS</h1>
          <p className="text-[10px] text-slate-500 mt-1">Authenticate to synchronize satellite navigator streams.</p>
        </div>

        <form onSubmit={joinSession} className="space-y-4">
          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Team Lead Name</label>
            <input
              type="text"
              required
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              placeholder="Enter your full name exactly"
              className="w-full bg-black/60 border border-slate-700 rounded px-3 py-2 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Crew Callsign (Name)</label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g., PHANTOM_NAVIGATORS"
              className="w-full bg-black/60 border border-slate-700 rounded px-3 py-2 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Topology Map Color Mapping</label>
            <div className="flex items-center gap-3 bg-black/40 p-2 border border-slate-800 rounded">
              <input
                type="color"
                value={teamColor}
                onChange={(e) => setTeamColor(e.target.value)}
                className="w-10 h-8 bg-transparent border-0 cursor-pointer rounded"
              />
              <span className="text-xs font-mono text-slate-500">{teamColor.toUpperCase()}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded tracking-widest uppercase transition-all"
          >
            ESTABLISH SIGNAL LINK
          </button>
        </form>

        {error && (
          <div className="mt-4 flex items-center gap-2 p-2.5 bg-rose-950/30 border border-rose-900 rounded text-[11px] text-rose-400">
            <ShieldAlert size={14} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};