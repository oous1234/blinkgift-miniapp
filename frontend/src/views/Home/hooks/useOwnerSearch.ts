import { useState, useEffect, useRef } from "react"
import OwnerService from "@services/owner"
import { OwnerProfile } from "../../../types/owner"
import { useCustomToast } from "@helpers/toastUtil"

export const useOwnerSearch = (query: string, type: "PROFILE" | "NFT") => {
  const [results, setResults] = useState<OwnerProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const showToast = useCustomToast()

  // Используем ref для debounce таймера
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Очищаем результаты если строка пустая или тип не PROFILE
    if (!query || query.trim().length < 2 || type !== "PROFILE") {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    // Очищаем предыдущий таймер
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Устанавливаем новый таймер (500мс задержка)
    debounceTimeout.current = setTimeout(async () => {
      try {
        const data = await OwnerService.searchOwners(query)
        setResults(data.owners || [])
      } catch (error) {
        console.error(error)
        showToast({
          title: "Search failed",
          status: "error",
          duration: 2000,
        })
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 500)

    // Cleanup function
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [query, type, showToast])

  return { results, isLoading }
}
