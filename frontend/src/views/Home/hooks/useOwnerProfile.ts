// frontend/src/views/Home/hooks/useOwnerProfile.ts

import { useState, useEffect, useCallback } from "react"
import OwnerService from "@services/owner"
import { OwnerProfile } from "../../../types/owner"
import { useCustomToast } from "@helpers/toastUtil"

export const useOwnerProfile = () => {
  // убрали range из параметров
  const [ownerData, setOwnerData] = useState<OwnerProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const showToast = useCustomToast()

  const fetchOwnerProfile = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await OwnerService.getOwnerInfo()
      setOwnerData(data)
    } catch (error) {
      showToast({ title: "Ошибка загрузки данных", status: "error" })
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchOwnerProfile()
  }, [fetchOwnerProfile]) // запрос только один раз при монтировании

  return { ownerData, isLoading, refetch: fetchOwnerProfile }
}
