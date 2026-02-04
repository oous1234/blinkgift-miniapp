import { useState, useEffect, useCallback } from "react"
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export interface SniperRule {
  id: string
  giftName: string
  models: string[]
  backdrops: string[]
  minPrice: string
  maxPrice: string
  minDiscount: string
  enabled: boolean
}

const RULES_KEY = "isnap_sniper_rules_v1"

export const useSniperLogic = () => {
  const [events, setEvents] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [rules, setRules] = useState<SniperRule[]>(() => {
    const saved = localStorage.getItem(RULES_KEY)
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem(RULES_KEY, JSON.stringify(rules))
  }, [rules])

  const saveRules = (newRules: SniperRule[]) => {
    setRules(newRules)
    // Здесь должен быть вызов API для обновления фильтров на бэкенде
  }

  useEffect(() => {
    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "8241853306"
    const socket = new SockJS('https://blinkback.ru.tuna.am/ws-deals')
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        setIsConnected(true)
        client.subscribe(`/user/${userId}/queue/sniper`, (message) => {
          const deal = JSON.parse(message.body)
          const enriched = {
            ...deal,
            id: deal.id || Date.now().toString(),
            receivedAt: Date.now(),
            imageUrl: `https://nft.fragment.com/gift/${deal.name.toLowerCase().replace(/#/g, "-").replace(/\s+/g, "")}.webp`
          }
          setEvents(prev => [enriched, ...prev].slice(0, 50))
        })
      },
      onDisconnect: () => setIsConnected(false)
    })
    client.activate()
    return () => { client.deactivate() }
  }, [])

  return { events, isConnected, rules, saveRules, clearHistory: () => setEvents([]) }
}