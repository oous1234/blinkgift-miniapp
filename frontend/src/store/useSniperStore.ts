import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SniperEvent, SniperRule, ConnectionStatus } from '../types/sniper';
import { SniperService } from '../services/sniper.service';

interface SniperState {
  events: SniperEvent[];
  rules: SniperRule[];
  status: ConnectionStatus;
  isLoading: boolean;

  addEvent: (event: SniperEvent) => void;
  setStatus: (status: ConnectionStatus) => void;
  clearEvents: () => void;
  initHistory: (userId: string) => Promise<void>;

  addRule: (rule: SniperRule) => void;
  updateRule: (id: string, updates: Partial<SniperRule>) => void;
  deleteRule: (id: string) => void;
}

export const useSniperStore = create<SniperState>()(
  persist(
    (set, get) => ({
      events: [],
      rules: [],
      status: 'DISCONNECTED',
      isLoading: false,

      addEvent: (event) => {
        const { events } = get();
        if (events.some(e => e.id === event.id)) return;

        if (window.Telegram?.WebApp?.HapticFeedback) {
          const type = (event.dealScore || 0) > 15 ? 'success' : 'warning';
          window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
        }

        set({
          events: [event, ...events].slice(0, 100)
        });
      },

      setStatus: (status) => set({ status }),

      clearEvents: () => set({ events: [] }),

      addRule: (rule) => set((state) => ({
        rules: [...state.rules, rule]
      })),

      updateRule: (id, updates) => set((state) => ({
        rules: state.rules.map(r => r.id === id ? { ...r, ...updates } : r)
      })),

      deleteRule: (id) => set((state) => ({
        rules: state.rules.filter(r => r.id !== id)
      })),

      initHistory: async (userId) => {
        set({ isLoading: true });
        try {
          const history = await SniperService.getMatchHistory(userId, 30);
          set({ events: history, isLoading: false });
        } catch (e) {
          console.error("Failed to load sniper history:", e);
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'isnap-sniper-storage',
      partialize: (state) => ({ rules: state.rules }),
    }
  )
);