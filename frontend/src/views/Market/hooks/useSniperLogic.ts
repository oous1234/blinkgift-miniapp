import { useState, useEffect, useCallback } from "react"
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const FILTERS_KEY = "isnap_sniper_filters_v3"
const EVENTS_KEY = "isnap_sniper_events_v3"

export interface SniperFilters {
  models: string[]
  backdrops: string[]
}

export const useSniperLogic = () => {
  // 1. Загружаем события из localStorage ПРИ СТАРТЕ
  const [events, setEvents] = useState<any[]>(() => {
    const savedEvents = localStorage.getItem(EVENTS_KEY)
    return savedEvents ? JSON.parse(savedEvents) : []
  })

  const [isConnected, setIsConnected] = useState(false)

  const [filters, setFilters] = useState<SniperFilters>(() => {
    const saved = localStorage.getItem(FILTERS_KEY)
    return saved ? JSON.parse(saved) : { models: [], backdrops: [] }
  })

  // Сохраняем события в localStorage при каждом изменении списка
  useEffect(() => {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
  }, [events])

  const applyFilters = useCallback((newFilters: SniperFilters) => {
    setFilters(newFilters)
    localStorage.setItem(FILTERS_KEY, JSON.stringify(newFilters))
    // Мы НЕ очищаем события автоматически, чтобы пользователь видел старые уловы
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
        console.log("Sniper active for user:", userId)

        client.subscribe(`/user/${userId}/queue/sniper`, (message) => {
          const deal = JSON.parse(message.body)

          const enriched = {
            ...deal,
            id: deal.id || Date.now().toString(), // Гарантируем ID для ключей
            imageUrl: `https://nft.fragment.com/gift/${deal.name.toLowerCase().replace(/#/g, "-").replace(/\s+/g, "")}.webp`
          }

          setEvents(prev => {
            // Проверка на дубликаты (чтобы не сохранять один и тот же подарок дважды)
            if (prev.some(e => e.id === enriched.id)) return prev
            // Добавляем в начало и ограничиваем историю (например, 50 последних)
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
  }, [filters]) // Переподписка при смене фильтров

  return { events, isConnected, filters, applyFilters, clearHistory }
}