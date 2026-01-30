import { useState, useEffect, useRef } from "react"
import OwnerService from "@services/owner"
import { OwnerProfile } from "../../../types/owner"
import { useCustomToast } from "@helpers/toastUtil"

export const useOwnerSearch = (query: string, type: "PROFILE" | "NFT") => {
  const [results, setResults] = useState<OwnerProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const showToast = useCustomToast()
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Если запрос пустой или тип не PROFILE — очищаем результаты
    if (!query || query.trim().length < 2 || type !== "PROFILE") {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        const data = await OwnerService.searchOwners(query)
        // ВАЖНО: OwnerService.searchOwners уже возвращает массив OwnerProfile[]
        // Поэтому устанавливаем data напрямую, без .owners
        setResults(data)
      } catch (error) {
        console.error("Search hook error:", error)
        showToast({
          title: "Ошибка поиска",
          status: "error",
          duration: 2000,
        })
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 500)

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [query, type, showToast])

  return { results, isLoading }
}