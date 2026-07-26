import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { GalaxyMap } from '../components/GalaxyMap';
import { ChallengePanel } from '../components/ChallengePanel';
import { Scoreboard } from '../components/Scoreboard';
import { Timer } from '../components/Timer';
import { Radio } from 'lucide-react';
import { TimeUpModal } from '../components/TimeUpModal';


export const Arena: React.FC = () => {
  const initSocket = useStore((state) => state.initSocket);
  const round = useStore((state) => state.round);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('');

  useEffect(() => {
    initSocket(import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000');
  }, [initSocket]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-6 selectable bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 tracking-widest uppercase">
            <Radio size={12} className="animate-pulse" />
            <span>Operational Interface Layer</span>
          </div>
          <h1 className="text-xl font-black tracking-wider text-slate-200 font-mono mt-0.5">
            OPERATION: ZERO SIGNAL
          </h1>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="font-mono bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-2 text-xs">
            <span className="text-slate-500 font-bold">PHASE: </span>
            <span className="text-sky-400 font-black">ROUND {round}</span>
          </div>
          <Timer />
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <GalaxyMap onSelectPlanet={setSelectedPlanetId} selectedPlanetId={selectedPlanetId} />
        </div>

        <div className="space-y-6">
          <ChallengePanel activePlanetId={selectedPlanetId} />
          <Scoreboard />
        </div>
      </main>
    </div>
  );
};
  <TimeUpModal />
