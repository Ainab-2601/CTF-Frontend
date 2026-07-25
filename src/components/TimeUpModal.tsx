import React from 'react'
import { useCountdown } from '../hooks/useCountdown'
import { AlertOctagon } from 'lucide-react'

export const TimeUpModal: React.FC = () => {
  const { timeRemaining, round } = useCountdown()

  if (timeRemaining > 0) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border-2 border-rose-600 rounded-2xl p-8 max-w-md w-full mx-4 text-center font-mono shadow-2xl shadow-rose-950/50">
        <AlertOctagon size={40} className="text-rose-500 mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-black text-rose-500 tracking-widest uppercase mb-2">
          TIME'S UP
        </h2>
        <p className="text-slate-400 text-sm mb-4">
          Round {round} has ended. Flag submissions are now locked.
        </p>
        <p className="text-slate-500 text-xs">
          Waiting for the admin to start the next round...
        </p>
      </div>
    </div>
  )
}
