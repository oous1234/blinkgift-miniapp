import { useState, useEffect, useCallback } from "react"
import OwnerService from "@services/owner"
import { OwnerProfile } from "../../../types/owner"
import { useCustomToast } from "@helpers/toastUtil"

export const useOwnerProfile = () => {
  const [ownerData, setOwnerData] = useState<OwnerProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  const showToast = useCustomToast()

  const fetchOwnerProfile = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)

    try {
      const data = await OwnerService.getOwnerInfo()
      setOwnerData(data)

      console.log("Owner data received:", data)
    } catch (error) {
      console.error(error)
      setIsError(true)
      showToast({
        title: "Failed to load profile info",
        status: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchOwnerProfile()
  }, [fetchOwnerProfile])

  return {
    ownerData,
    isLoading,
    isError,
    refetch: fetchOwnerProfile,
  }
}