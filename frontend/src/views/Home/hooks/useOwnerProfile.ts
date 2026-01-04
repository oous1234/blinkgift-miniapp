import { useState, useEffect, useCallback } from "react"
import OwnerService from "@services/owner"
import { PortfolioHistoryResponse } from "../../../types/owner" // Импортируем новый тип
import { useCustomToast } from "@helpers/toastUtil"

export const useOwnerProfile = (range: string) => {
  const [historyData, setHistoryData] = useState<PortfolioHistoryResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const showToast = useCustomToast()

  const fetchOwnerProfile = useCallback(async () => {
    setIsLoading(true)
    try {
      // Здесь OwnerService.getOwnerInfo возвращает ваш объект {range, data}
      const data = await OwnerService.getOwnerInfo(range)
      setHistoryData(data as unknown as PortfolioHistoryResponse)
    } catch (error) {
      console.error("Profile load error:", error)
      showToast({ title: "Ошибка загрузки графика", status: "error" })
    } finally {
      setIsLoading(false)
    }
  }, [range, showToast])

  useEffect(() => {
    fetchOwnerProfile()
  }, [fetchOwnerProfile])

  return { historyData, isLoading, refetch: fetchOwnerProfile }
}
