import { create } from 'zustand'

interface UIState {
  isSearchOpen: boolean
  isSettingsOpen: boolean
  isSubscriptionOpen: boolean
  isDetailOpen: boolean
  isSniperFiltersOpen: boolean

  openSearch: () => void
  closeSearch: () => void

  openSettings: () => void
  closeSettings: () => void

  openSubscription: () => void
  closeSubscription: () => void

  openDetail: () => void
  closeDetail: () => void

  openSniperFilters: () => void
  closeSniperFilters: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  isSettingsOpen: false,
  isSubscriptionOpen: false,
  isDetailOpen: false,
  isSniperFiltersOpen: false,

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),

  openSubscription: () => set({ isSubscriptionOpen: true }),
  closeSubscription: () => set({ isSubscriptionOpen: false }),

  openDetail: () => set({ isDetailOpen: true }),
  closeDetail: () => set({ isDetailOpen: false }),

  openSniperFilters: () => set({ isSniperFiltersOpen: true }),
  closeSniperFilters: () => set({ isSniperFiltersOpen: false }),
}))