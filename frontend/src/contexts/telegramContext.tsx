import React, { createContext, useContext, useEffect, useState, useMemo } from "react"
import WalletService from "../services/wallet"
import { API_CONFIG } from "../config/constants"

interface TelegramContextType {
  tg: any
  user: any
  isReady: boolean
  balance: number | null
  refreshBalance: () => Promise<void>
  haptic: {
    impact: (style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notification: (type: 'error' | 'success' | 'warning') => void
    selection: () => void
  }
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined)

export const TelegramContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number | null>(null)
  const [isReady, setIsReady] = useState(false)

  const tg = window.Telegram?.WebApp

  const user = useMemo(() => {
    return tg?.initDataUnsafe?.user || {
      id: Number(API_CONFIG.DEFAULT_USER_ID),
      first_name: "Developer",
      username: "dev_user",
    };
  }, [tg]);

  const haptic = useMemo(() => ({
    impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') =>
      tg?.HapticFeedback?.impactOccurred(style),
    notification: (type: 'error' | 'success' | 'warning') =>
      tg?.HapticFeedback?.notificationOccurred(type),
    selection: () =>
      tg?.HapticFeedback?.selectionChanged(),
  }), [tg]);

  const refreshBalance = async () => {
    try {
      const val = await WalletService.getBalance()
      setBalance(val)
    } catch (e) {
      console.error("Balance refresh failed", e)
    }
  }

  useEffect(() => {
    if (tg) {
      tg.ready()
      tg.expand()
      setIsReady(true)
      refreshBalance()
    }
  }, [tg])

  const value = useMemo(() => ({
    tg,
    user,
    isReady,
    balance,
    refreshBalance,
    haptic
  }), [isReady, balance, user, haptic, tg])

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  )
}

export const useTelegram = () => {
  const context = useContext(TelegramContext)
  if (context === undefined) {
    throw new Error("useTelegram must be used within a TelegramContextProvider")
  }
  return context
}