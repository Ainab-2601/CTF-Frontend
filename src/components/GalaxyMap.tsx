import React from 'react'
import { useStore } from '../store/useStore'

interface GalaxyMapProps {
  onSelectPlanet: (id: string) => void
  selectedPlanetId: string
}

const mapCoordinates: Record<string, { cx: number; cy: number; r: number }> = {
  krypton: { cx: 200, cy: 160, r: 35 },
  phantom: { cx: 420, cy: 130, r: 40 },
  oracle: { cx: 720, cy: 180, r: 32 },
  nebula: { cx: 240, cy: 440, r: 45 },
  axiom: { cx: 500, cy: 480, r: 38 },
  'void-core': { cx: 800, cy: 400, r: 55 },
}

export const GalaxyMap: React.FC<GalaxyMapProps> = ({ onSelectPlanet, selectedPlanetId }) => {
  const planets = useStore((state) => state.planets)
  const summitHolderId = useStore((state) => state.summitHolderId)
  const leaderboard = useStore((state) => state.leaderboard)

  const getSummitColor = () => {
    const holder = leaderboard.find((t) => t.id === summitHolderId)
    return holder ? holder.color : '#e11d48'
  }

  return (
    <div className="relative w-full bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 overflow-hidden backdrop-blur-xl shadow-2xl shadow-black/50">
      <div className="absolute top-4 left-4 z-10 font-mono">
        <h3 className="text-xs font-bold tracking-widest text-emerald-400 uppercase">Live Galaxy Topology</h3>
        <p className="text-[10px] text-slate-500 mt-0.5">Select a node to submit flags.</p>
      </div>

      <svg viewBox="0 0 1000 600" className="w-full h-auto select-none">
        <path d="M 200 160 L 420 130 L 720 180 L 800 400 L 500 480 L 240 440 Z" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="8,4" />

        {Object.entries(mapCoordinates).map(([id, coords]) => {
          const planet = planets[id]
          if (!planet) return null
          const isSelected = selectedPlanetId === id

          return (
            <g
              key={id}
              onClick={() => planet.isUnlocked && onSelectPlanet(id)}
              className={`group ${planet.isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-20'}`}
            >
              <circle
                cx={coords.cx}
                cy={coords.cy}
                r={coords.r + 12}
                fill="none"
                stroke={planet.ownerColor}
                strokeWidth={isSelected ? '2' : '1'}
                opacity={isSelected ? 0.8 : 0}
              />
              <circle
                cx={coords.cx}
                cy={coords.cy}
                r={coords.r}
                fill={planet.ownerColor}
                stroke="#020617"
                strokeWidth="4"
              />
              <text
                x={coords.cx}
                y={coords.cy + coords.r + 22}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {planet.name}
              </text>
            </g>
          )
        })}

        {planets['the-summit']?.isUnlocked && (
          <g onClick={() => onSelectPlanet('the-summit')} className="cursor-pointer">
            <polygon
              points="500,250 545,330 455,330"
              fill={getSummitColor()}
              stroke="#020617"
              strokeWidth="2"
            />
            <text x="500" y="355" textAnchor="middle" fill="#fb7185" fontSize="11" fontFamily="monospace" fontWeight="bold">
              [ THE SUMMIT ]
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}