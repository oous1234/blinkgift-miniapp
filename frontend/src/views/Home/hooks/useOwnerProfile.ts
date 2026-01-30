import { useState, useEffect, useCallback } from "react"
import OwnerService from "@services/owner"
import { HistoryPoint } from "../../../types"

export const useOwnerProfile = (range: string, customOwnerId?: string) => {
  const [historyData, setHistoryData] = useState<HistoryPoint[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchOwnerProfile = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await OwnerService.getPortfolioHistory(range, customOwnerId)
      setHistoryData(data)
    } catch (error) {
      console.error("Profile load error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [range, customOwnerId])

  useEffect(() => {
    fetchOwnerProfile()
  }, [fetchOwnerProfile])

  return { historyData, isLoading, refetch: fetchOwnerProfile }
}