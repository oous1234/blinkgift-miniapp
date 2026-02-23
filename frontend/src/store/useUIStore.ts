import { create } from 'zustand'
import { Gift } from '../types/domain'

interface UIState {
  // Состояния открытия
  isSearchOpen: boolean
  isSettingsOpen: boolean
  isSubscriptionOpen: boolean
  isDetailOpen: boolean
  isSniperFiltersOpen: boolean

  // Данные выбранного подарка (Глобальные)
  selectedGift: Gift | null
  isDetailLoading: boolean

  openSearch: () => void
  closeSearch: () => void
  openSettings: () => void
  closeSettings: () => void
  openSubscription: () => void
  closeSubscription: () => void

  // Управление деталями
  openDetail: (gift?: Gift) => void
  closeDetail: () => void
  setDetailLoading: (loading: boolean) => void
  setSelectedGift: (gift: Gift | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  isSettingsOpen: false,
  isSubscriptionOpen: false,
  isDetailOpen: false,
  isSniperFiltersOpen: false,

  selectedGift: null,
  isDetailLoading: false,

  openSearch: () => set({ isSearchOpen: true, isSettingsOpen: false }),
  closeSearch: () => set({ isSearchOpen: false }),
  openSettings: () => set({ isSettingsOpen: true, isSearchOpen: false }),
  closeSettings: () => set({ isSettingsOpen: false }),
  openSubscription: () => set({ isSubscriptionOpen: true }),
  closeSubscription: () => set({ isSubscriptionOpen: false }),

  // При открытии обнуляем старый подарок, если не передали новый
  openDetail: (gift) => set({
    isDetailOpen: true,
    selectedGift: gift || null
  }),

  closeDetail: () => set({
    isDetailOpen: false,
    selectedGift: null,
    isDetailLoading: false
  }),

  setDetailLoading: (loading) => set({ isDetailLoading: loading }),
  setSelectedGift: (gift) => set({ selectedGift: gift })
}))