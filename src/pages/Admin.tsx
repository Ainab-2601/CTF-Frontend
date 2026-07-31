import React, { useEffect, useState } from 'react'
import { Shield, Play, RotateCcw, Trash2, Trophy, Square, Skull } from 'lucide-react'

interface Team {
  id: string
  name: string
  color: string
  totalScore: number
  flagPoints: number
  passivePoints: number
  planetsOwned: number
  eliminated: boolean
}

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
const ADMIN_PASSWORD = 'zerosignal2025'

export const Admin: React.FC = () => {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [round, setRound] = useState(1)
  const [duration, setDuration] = useState(2700)
  const [message, setMessage] = useState('')

  const fetchLeaderboard = async () => {
    const res = await fetch(`${BACKEND}/api/scores/leaderboard`)
    const data = await res.json()
    setTeams(data)
  }

  useEffect(() => {
    if (authed) {
      fetchLeaderboard()
      const interval = setInterval(fetchLeaderboard, 30000)
      return () => clearInterval(interval)
    }
  }, [authed])

  const changeRound = async () => {
    const res = await fetch(`${BACKEND}/api/rounds/change`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ round, durationSeconds: duration })
    })
    const data = await res.json()
    setMessage(data.message)
    fetchLeaderboard()
    setTimeout(() => setMessage(''), 3000)
  }

  const endRound = async () => {
    if (!confirm('Current round turant khatam ho jayega — flag submissions lock ho jayenge jab tak naya round start na ho. Confirm?')) return
    const res = await fetch(`${BACKEND}/api/rounds/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    setMessage(data.message)
    fetchLeaderboard()
    setTimeout(() => setMessage(''), 3000)
  }

  const eliminateLowest = async () => {
    if (!confirm('Sabse kam score wali 3 active teams eliminate ho jaayengi. Confirm?')) return
    const res = await fetch(`${BACKEND}/api/rounds/eliminate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    setMessage(data.message)
    fetchLeaderboard()
    setTimeout(() => setMessage(''), 3000)
  }

  const resetDatabase = async () => {
    if (!confirm('Sab scores aur submissions delete ho jaayenge — confirm?')) return
    const res = await fetch(`${BACKEND}/api/admin/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminPassword: ADMIN_PASSWORD })
    })
    const data = await res.json()
    setMessage(data.message)
    fetchLeaderboard()
    setTimeout(() => setMessage(''), 3000)
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-sm font-mono">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={20} className="text-emerald-400" />
            <h1 className="text-sm font-black tracking-widest text-slate-200 uppercase">Admin Access</h1>
          </div>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && password === ADMIN_PASSWORD && setAuthed(true)}
            className="w-full bg-black/60 border border-slate-700 rounded px-3 py-2 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 mb-3"
          />
          <button
            onClick={() => password === ADMIN_PASSWORD ? setAuthed(true) : setMessage('Wrong password')}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded tracking-widest uppercase"
          >
            LOGIN
          </button>
          {message && <p className="text-rose-400 text-xs mt-2 text-center">{message}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-mono">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
          <Shield size={20} className="text-emerald-400" />
          <h1 className="text-lg font-black tracking-widest uppercase">ZERO SIGNAL — ADMIN PANEL</h1>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800 rounded text-emerald-400 text-xs">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-slate-300 text-xs uppercase tracking-widest border-b border-slate-800 pb-2">
              <Play size={14} className="text-sky-400" />
              <span>Round Control</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider">Round Number</label>
                <input
                  type="number"
                  min={1}
                  max={4}
                  value={round}
                  onChange={(e) => setRound(Number(e.target.value))}
                  className="w-full mt-1 bg-black/60 border border-slate-700 rounded px-3 py-2 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider">Duration</label>
                <div className="flex gap-2 mt-1">
                  {[1800, 2700, 3600].map(s => (
                    <button
                      key={s}
                      onClick={() => setDuration(s)}
                      className={`flex-1 text-xs py-1.5 rounded border transition-all ${duration === s ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-black/40 border-slate-700 text-slate-400'}`}
                    >
                      {s / 60}min
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={changeRound}
                className="w-full bg-sky-700 hover:bg-sky-600 text-white text-xs font-bold py-2 rounded tracking-widest uppercase transition-all"
              >
                START ROUND {round}
              </button>
              <button
                onClick={endRound}
                className="w-full flex items-center justify-center gap-2 bg-amber-900/40 hover:bg-amber-800/60 border border-amber-800 text-amber-400 text-xs font-bold py-2 rounded tracking-widest uppercase transition-all"
              >
                <Square size={12} />
                END CURRENT ROUND
              </button>
              <button
                onClick={eliminateLowest}
                className="w-full flex items-center justify-center gap-2 bg-rose-900/40 hover:bg-rose-800/60 border border-rose-800 text-rose-400 text-xs font-bold py-2 rounded tracking-widest uppercase transition-all"
              >
                <Skull size={12} />
                ELIMINATE LOWEST 3
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-rose-900/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-rose-400 text-xs uppercase tracking-widest border-b border-rose-900/40 pb-2">
              <Trash2 size={14} />
              <span>Danger Zone</span>
            </div>
            <p className="text-[10px] text-slate-500 mb-4">Sab scores, submissions aur planet ownership delete ho jaayega.</p>
            <button
              onClick={resetDatabase}
              className="w-full bg-rose-900/40 hover:bg-rose-800/60 border border-rose-800 text-rose-400 text-xs font-bold py-2 rounded tracking-widest uppercase transition-all"
            >
              RESET ALL DATA
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-slate-300 text-xs uppercase tracking-widest">
              <Trophy size={14} className="text-amber-500" />
              <span>Live Leaderboard</span>
            </div>
            <button onClick={fetchLeaderboard} className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1">
              <RotateCcw size={10} /> Refresh
            </button>
          </div>
          <div className="space-y-2">
            {teams.map((team, idx) => (
              <div key={team.id} className={`flex items-center justify-between border rounded px-3 py-2.5 ${
                team.eliminated ? 'bg-rose-950/10 border-rose-900/30 opacity-60' : 'bg-black/30 border-slate-900'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500 w-4">#{idx + 1}</span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: team.color }} />
                  <span className={`text-xs ${team.eliminated ? 'text-rose-500 line-through' : 'text-slate-300'}`}>
                    {team.name}
                  </span>
                  {team.eliminated && (
                    <span className="text-[9px] text-rose-500 border border-rose-900 px-1 rounded">ELIMINATED</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-[10px] text-slate-500">
                  <span>🚩 {team.flagPoints} pts</span>
                  <span>🌍 {team.planetsOwned} planets</span>
                  <span className={`font-bold text-xs ${team.eliminated ? 'text-rose-500' : 'text-emerald-400'}`}>
                    {team.eliminated ? '💀' : `${team.totalScore} PTS`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}