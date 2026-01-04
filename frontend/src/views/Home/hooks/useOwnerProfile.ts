import { useState, useEffect, useCallback } from "react"
import OwnerService from "@services/owner"
import { OwnerProfile } from "../../../types/owner"
import { useCustomToast } from "@helpers/toastUtil"

export const useOwnerProfile = (range: string = "24h") => {
  const [ownerData, setOwnerData] = useState<OwnerProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  const showToast = useCustomToast()

  const fetchOwnerProfile = useCallback(
    async (currentRange: string) => {
      setIsLoading(true)
      setIsError(false)

      try {
        // Теперь сервис принимает range и передает его на бэкенд
        const data = await OwnerService.getOwnerInfo()
        setOwnerData(data)
      } catch (error) {
        console.error("Error fetching owner profile:", error)
        setIsError(true)
        showToast({
          title: "Ошибка загрузки данных профиля",
          status: "error",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [showToast]
  )

  // Перезапрашиваем данные каждый раз, когда меняется range
  useEffect(() => {
    fetchOwnerProfile(range)
  }, [range, fetchOwnerProfile])

  return {
    ownerData,
    isLoading,
    isError,
    refetch: () => fetchOwnerProfile(range),
  }
}
