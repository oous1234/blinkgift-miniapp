import { useState, useEffect, useCallback, useMemo } from "react"
import { InventoryService } from "../services/inventory.service"
import { OwnerService } from "../services/owner.service"
import { Gift, UserProfile } from "../types/domain"
import { API_CONFIG } from "../constants/config"

export const usePortfolio = (ownerId?: string, range: string = "30d") => {
  const targetId = ownerId || window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || API_CONFIG.DEFAULT_USER_ID

  const [items, setItems] = useState<Partial<Gift>[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    try {
      const [invData, historyData] = await Promise.all([
        InventoryService.getInventory(targetId, 10, (page - 1) * 10),
        OwnerService.getPortfolioHistory(targetId, range)
      ])
      setItems(invData.items)
      setTotal(invData.total)
      setHistory(historyData)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [targetId, page, range])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const analytics = useMemo(() => {
    if (history.length < 2) return { current: 0, pnl: 0, percent: 0 }
    const first = history[0].average.ton
    const last = history[history.length - 1].average.ton
    const pnl = last - first
    return {
      current: last,
      pnl,
      percent: first > 0 ? (pnl / first) * 100 : 0
    }
  }, [history])

  return { items, total, page, setPage, history, analytics, isLoading, refetch: fetchAll }
}