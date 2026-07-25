import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export interface TeamScore {
  id: string;
  name: string;
  color: string;
  totalScore: number;
  eliminated: boolean;
}

export interface PlanetState {
  id: string;
  name: string;
  ownerId: string | null;
  ownerColor: string;
  isUnlocked: boolean;
}

interface CTFState {
  round: number;
  endTime: number; // timestamp (ms) jab timer khatam hoga
  roundLoaded: boolean; // true jab tak backend se asal round data na aa jaye
  leaderboard: TeamScore[];
  planets: Record<string, PlanetState>;
  summitHolderId: string | null;
  socket: Socket | null;
  currentTeamId: string | null;
  setCurrentTeam: (teamId: string) => void;
  initSocket: (backendUrl: string) => void;
  fetchInitialState: (backendUrl: string) => Promise<void>;
}

const INITIAL_PLANETS: Record<string, PlanetState> = {
  krypton: { id: 'krypton', name: 'Krypton', ownerId: null, ownerColor: '#334155', isUnlocked: true },
  phantom: { id: 'phantom', name: 'Phantom', ownerId: null, ownerColor: '#334155', isUnlocked: true },
  oracle: { id: 'oracle', name: 'Oracle', ownerId: null, ownerColor: '#334155', isUnlocked: true },
  nebula: { id: 'nebula', name: 'Nebula', ownerId: null, ownerColor: '#334155', isUnlocked: false },
  axiom: { id: 'axiom', name: 'Axiom', ownerId: null, ownerColor: '#334155', isUnlocked: false },
  'void-core': { id: 'void-core', name: 'Void Core', ownerId: null, ownerColor: '#1e1b4b', isUnlocked: false },
  'the-summit': { id: 'the-summit', name: 'The Summit', ownerId: null, ownerColor: '#e11d48', isUnlocked: false },
};

export const useStore = create<CTFState>((set, get) => ({
  round: 1,
  endTime: Date.now() + 2700 * 1000,
  roundLoaded: false,
  leaderboard: [],
  planets: INITIAL_PLANETS,
  summitHolderId: null,
  socket: null,
  currentTeamId: localStorage.getItem('team_id'),

  setCurrentTeam: (teamId: string) => {
    localStorage.setItem('team_id', teamId);
    set({ currentTeamId: teamId });
  },

  initSocket: (backendUrl: string) => {
    if (get().socket) return;

    const socketInstance = io(backendUrl);

    socketInstance.on('round:change', (data: { round: number; startedAt: number; durationSeconds: number }) => {
      set((state) => {
        const updatedPlanets = {
          ...state.planets,
          krypton:      { ...state.planets['krypton'],      isUnlocked: data.round === 1 },
          phantom:      { ...state.planets['phantom'],      isUnlocked: data.round === 1 },
          oracle:       { ...state.planets['oracle'],       isUnlocked: data.round === 1 },
          nebula:       { ...state.planets['nebula'],       isUnlocked: data.round === 2 },
          axiom:        { ...state.planets['axiom'],        isUnlocked: data.round === 2 },
          'void-core':  { ...state.planets['void-core'],   isUnlocked: data.round === 3 },
          'the-summit': { ...state.planets['the-summit'],  isUnlocked: data.round === 4 },
        };
        return {
          round: data.round,
          endTime: data.startedAt + data.durationSeconds * 1000,
          roundLoaded: true,
          planets: updatedPlanets,
        };
      });
    });

    socketInstance.on('territory:claim', (data: { planetId: string; teamId: string }) => {
      const targetTeam = get().leaderboard.find((t) => t.id === data.teamId);
      if (targetTeam) {
        set((state) => ({
          planets: {
            ...state.planets,
            [data.planetId]: {
              ...state.planets[data.planetId],
              ownerId: data.teamId,
              ownerColor: targetTeam.color,
            },
          },
        }));
      }
    });

    socketInstance.on('teams:eliminated', (data: { eliminatedIds: string[] }) => {
      const currentTeamId = get().currentTeamId
      if (currentTeamId && data.eliminatedIds.includes(currentTeamId)) {
        set({ currentTeamId: null })
        localStorage.removeItem('team_id')
      }
      get().fetchInitialState(backendUrl)
    });

    socketInstance.on('summit:capture', (data: { teamId: string }) => {
      set({ summitHolderId: data.teamId });
    });

    socketInstance.on('score:update', () => {
      get().fetchInitialState(backendUrl);
    });

    set({ socket: socketInstance });
    get().fetchInitialState(backendUrl);
  },

  fetchInitialState: async (backendUrl: string) => {
    // Dono requests PARALLEL mein bhejo — ek doosre ka wait nahi karta,
    // isliye leaderboard slow ho toh bhi round/timer turant load hoga
    const leaderboardPromise = fetch(`${backendUrl}/api/scores/leaderboard`)
      .then(res => res.json())
      .then(data => set({ leaderboard: data }))
      .catch(err => console.error('Failed to update telemetry metrics:', err));

    const roundPromise = fetch(`${backendUrl}/api/rounds/current`)
      .then(res => res.json())
      .then(roundData => {
        set((state) => {
          const updatedPlanets = {
            ...state.planets,
            krypton:      { ...state.planets['krypton'],      isUnlocked: roundData.round === 1 },
            phantom:      { ...state.planets['phantom'],      isUnlocked: roundData.round === 1 },
            oracle:       { ...state.planets['oracle'],       isUnlocked: roundData.round === 1 },
            nebula:       { ...state.planets['nebula'],       isUnlocked: roundData.round === 2 },
            axiom:        { ...state.planets['axiom'],        isUnlocked: roundData.round === 2 },
            'void-core':  { ...state.planets['void-core'],   isUnlocked: roundData.round === 3 },
            'the-summit': { ...state.planets['the-summit'],  isUnlocked: roundData.round === 4 },
          };
          return {
            round: roundData.round,
            endTime: roundData.startedAt + roundData.durationSeconds * 1000,
            roundLoaded: true,
            planets: updatedPlanets,
          };
        });
      })
      .catch(err => console.error('Failed to fetch round state:', err));

    await Promise.allSettled([leaderboardPromise, roundPromise]);
  },
}));