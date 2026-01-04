// frontend/src/views/Home/hooks/useOwnerProfile.ts

import { useState, useEffect, useCallback } from "react"
import OwnerService from "@services/owner"
import { OwnerProfile } from "../../../types/owner"
import { useCustomToast } from "@helpers/toastUtil"

export const useOwnerProfile = (range: string) => {
  const [historyData, setHistoryData] = useState<PortfolioHistory | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const showToast = useCustomToast()

  const fetchOwnerProfile = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await OwnerService.getOwnerInfo(range)
      setHistoryData(data)
    } catch (error) {
      showToast({ title: "Ошибка загрузки графика", status: "error" })
    } finally {
      setIsLoading(false)
    }
  }, [range, showToast])

  useEffect(() => {
    fetchOwnerProfile()
  }, [fetchOwnerProfile]) // Сработает каждый раз, когда изменится range

  return { historyData, isLoading, refetch: fetchOwnerProfile }
}
