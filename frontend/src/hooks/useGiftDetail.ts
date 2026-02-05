import { useState, useCallback } from "react"
import { Gift } from "../types/domain"
import { InventoryService } from "../services/inventory.service"

export const useGiftDetail = () => {
  const [gift, setGift] = useState<Gift | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadDetail = useCallback(async (slug: string, num: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await InventoryService.getGiftDetail(slug, num)
      setGift(data)

      setIsHistoryLoading(true)
      const blockchainData = await InventoryService.getBlockchainHistory(data.id)
      setHistory(blockchainData.history || [])
    } catch (e) {
      setError("Failed to load gift details")
    } finally {
      setIsLoading(false)
      setIsHistoryLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setGift(null)
    setHistory([])
    setError(null)
  }, [])

  return { gift, history, isLoading, isHistoryLoading, error, loadDetail, reset }
}