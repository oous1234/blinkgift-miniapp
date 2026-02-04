import { useState, useEffect, useCallback } from "react"
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import SniperService from "@services/sniper"

const FILTERS_KEY = "isnap_sniper_filters_v3"
const EVENTS_KEY = "isnap_sniper_events_v3"

export interface SniperFilters {
  models: string[]
  backdrops: string[]
}

export const useSniperLogic = () => {
  const [events, setEvents] = useState<any[]>(() => {
    const savedEvents = localStorage.getItem(EVENTS_KEY)
    return savedEvents ? JSON.parse(savedEvents) : []
  })

  const [isConnected, setIsConnected] = useState(false)
  const [filters, setFilters] = useState<SniperFilters>(() => {
    const saved = localStorage.getItem(FILTERS_KEY)
    return saved ? JSON.parse(saved) : { models: [], backdrops: [] }
  })

  useEffect(() => {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
  }, [events])

  const applyFilters = useCallback(async (newFilters: SniperFilters) => {
    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "1342062477"

    // Сначала сохраняем локально, чтобы интерфейс не тупил
    setFilters(newFilters)
    localStorage.setItem(FILTERS_KEY, JSON.stringify(newFilters))

    // Затем синхронизируем с сервером
    try {
      await SniperService.updateFilters(userId, newFilters)
      console.log("✅ Фильтры синхронизированы с бекендом")
    } catch (e) {
      console.error("❌ Ошибка синхронизации фильтров", e)
    }
  }, [])

  const clearHistory = useCallback(() => {
    setEvents([])
    localStorage.removeItem(EVENTS_KEY)
  }, [])

  useEffect(() => {
    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "1342062477"
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
            imageUrl: `https://nft.fragment.com/gift/${deal.name.toLowerCase().replace(/#/g, "-").replace(/\s+/g, "")}.webp`
          }
          setEvents(prev => {
            if (prev.some(e => e.id === enriched.id)) return prev
            return [enriched, ...prev].slice(0, 50)
          })
          if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
          }
        })
      },
      onDisconnect: () => setIsConnected(false),
    })
    client.activate()
    return () => { client.deactivate() }
  }, [])

  return { events, isConnected, filters, applyFilters, clearHistory }
}