// src/store/useSniperStore.ts
import { create } from 'zustand';
import { SniperEvent, ConnectionStatus } from '../types/sniper';

interface SniperState {
  events: SniperEvent[];
  status: ConnectionStatus;
  
  addEvent: (event: SniperEvent) => void;
  setStatus: (status: ConnectionStatus) => void;
  clearEvents: () => void;
}

export const useSniperStore = create<SniperState>((set) => ({
  events: [],
  status: 'DISCONNECTED',

  addEvent: (event) => set((state) => {
    if (state.events.some(e => e.id === event.id)) return state;
    
    const newEvents = [event, ...state.events].slice(0, 100);
    return { events: newEvents };
  }),

  setStatus: (status) => set({ status }),

  clearEvents: () => set({ events: [] }),
}));