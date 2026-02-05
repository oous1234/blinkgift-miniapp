import { useState, useCallback } from "react"
import { ChangesService } from "../services/changes.service"

const cache: Record<string, any[]> = {}

export const useAttributeCache = () => {
  const [isLoading, setIsLoading] = useState(false)

  const getAttributes = useCallback(async (giftName: string, type: 'models' | 'patterns' | 'backdrops') => {
    const cacheKey = `${giftName}-${type}`

    if (cache[cacheKey]) {
      return cache[cacheKey]
    }

    setIsLoading(true)
    try {
      let data: any[] = []
      switch (type) {
        case 'models': data = await ChangesService.getModels(giftName); break
        case 'patterns': data = await ChangesService.getPatterns(giftName); break
        case 'backdrops': data = await ChangesService.getBackdrops(giftName); break
      }
      cache[cacheKey] = data
      return data
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { getAttributes, isLoading }
}