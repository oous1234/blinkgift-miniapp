import React, { createContext, useContext, useEffect, useState, useMemo } from "react"
import { WebApp } from "@grammyjs/web-app"
import WalletService from "@services/wallet"

interface TelegramContextType {
  webApp: typeof WebApp
  user: typeof WebApp.initDataUnsafe.user
  isReady: boolean
  balance: number | null
  refreshBalance: () => Promise<void>
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined)

export const TelegramContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<number | null>(null)
  const [isReady, setIsReady] = useState(false)

  const refreshBalance = async () => {
    try {
      const val = await WalletService.getBalance()
      if (val !== undefined) setBalance(val)
    } catch (e) {
      console.error("Balance refresh failed", e)
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()

      if (tg.disableVerticalSwipes) {
        tg.disableVerticalSwipes()
      }

      setIsReady(true)
      refreshBalance()
    }
  }, [])

  const value = useMemo(() => ({
    webApp: WebApp,
    user: WebApp.initDataUnsafe.user,
    isReady,
    balance,
    refreshBalance
  }), [isReady, balance])

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