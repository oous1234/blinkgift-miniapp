import { useState, useEffect, useCallback } from "react"
import OwnerService from "@services/owner"
import { PortfolioHistoryResponse } from "../../../types/owner"
import { useCustomToast } from "@helpers/toastUtil"

// Добавляем аргумент customOwnerId
export const useOwnerProfile = (range: string, customOwnerId?: string) => {
  const [historyData, setHistoryData] = useState<PortfolioHistoryResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const showToast = useCustomToast()

  const fetchOwnerProfile = useCallback(async () => {
    setIsLoading(true)
    try {
      // Передаем customOwnerId
      const data = await OwnerService.getOwnerInfo(range, customOwnerId)
      setHistoryData(data as unknown as PortfolioHistoryResponse)
    } catch (error) {
      console.error("Profile load error:", error)
      showToast({ title: "Ошибка загрузки графика", status: "error" })
    } finally {
      setIsLoading(false)
    }
  }, [range, customOwnerId, showToast])

  useEffect(() => {
    fetchOwnerProfile()
  }, [fetchOwnerProfile])

  return { historyData, isLoading, refetch: fetchOwnerProfile }
}
