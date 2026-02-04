import { create } from 'zustand';
import { SniperEvent, SniperRule, ConnectionStatus } from '../types/sniper';
import SniperService from '../services/sniper.service';

interface SniperState {
  events: SniperEvent[];
  rules: SniperRule[];
  status: ConnectionStatus;
  isLoading: boolean;

  // Actions
  addEvent: (event: SniperEvent) => void;
  setStatus: (status: ConnectionStatus) => void;
  clearEvents: () => void;

  // Logic Actions
  initTerminal: (userId: string) => Promise<void>;
  addRule: (rule: SniperRule) => void;
  updateRule: (id: string, updates: Partial<SniperRule>) => void;
  deleteRule: (id: string) => void;
}

export const useSniperStore = create<SniperState>((set, get) => ({
  events: [],
  rules: [],
  status: 'DISCONNECTED',
  isLoading: false,

  addEvent: (event) => set((state) => {
    if (state.events.some(e => e.id === event.id)) return state;
    return { events: [event, ...state.events].slice(0, 100) };
  }),

  setStatus: (status) => set({ status }),

  clearEvents: () => set({ events: [] }),

  initTerminal: async (userId: string) => {
    set({ isLoading: true });
    try {
      // 1. Загружаем историю из БД
      const history = await SniperService.getMatchHistory(userId, 30);

      const formattedEvents: SniperEvent[] = (history || []).map(item => ({
        id: item.id,
        name: item.name || item.giftName,
        model: item.model || 'Standard',
        backdrop: item.backdrop || '',
        symbol: item.symbol || '',
        price: item.price || 0,
        marketplace: item.marketplace || 'FRAGMENT',
        address: item.address || '',
        receivedAt: item.createdAt ? new Date(item.createdAt).getTime() : Date.now(),
        imageUrl: `https://nft.fragment.com/gift/${(item.name || item.giftName || '').toLowerCase().replace(/#/g, "-").replace(/\s+/g, "")}.webp`,
        dealScore: item.dealScore || 0,
        isOffchain: false
      }));

      // 2. Пытаемся загрузить правила (пока из localStorage, позже подключим API)
      const savedRules = localStorage.getItem("isnap_sniper_rules_v2");
      const rules = savedRules ? JSON.parse(savedRules) : [];

      set({
        events: formattedEvents,
        rules: rules,
        isLoading: false
      });
    } catch (error) {
      console.error("Init Terminal Error:", error);
      set({ isLoading: false });
    }
  },

  addRule: (rule) => set((state) => {
    const newRules = [...state.rules, rule];
    localStorage.setItem("isnap_sniper_rules_v2", JSON.stringify(newRules));
    return { rules: newRules };
  }),

  updateRule: (id, updates) => set((state) => {
    const newRules = state.rules.map(r => r.id === id ? { ...r, ...updates } : r);
    localStorage.setItem("isnap_sniper_rules_v2", JSON.stringify(newRules));
    return { rules: newRules };
  }),

  deleteRule: (id) => set((state) => {
    const newRules = state.rules.filter(r => r.id !== id);
    localStorage.setItem("isnap_sniper_rules_v2", JSON.stringify(newRules));
    return { rules: newRules };
  }),
}));