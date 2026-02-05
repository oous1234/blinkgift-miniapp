import { useState, useCallback, useRef } from "react"
import { OwnerService } from "../services/owner.service"
import { UserProfile } from "../types/domain"

export const useSearch = () => {
  const [results, setResults] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const search = useCallback((query: string) => {
    if (query.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(async () => {
      try {
        const data = await OwnerService.searchOwners(query)
        setResults(data)
      } catch (e) {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 500)
  }, [])

  return { results, isLoading, search }
}