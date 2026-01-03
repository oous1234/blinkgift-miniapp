import { useState, useEffect, useCallback } from "react"
import InventoryService from "@services/inventory"
import { GiftItem } from "../../../types/inventory"
import { useCustomToast } from "@helpers/toastUtil"

export const useInventory = () => {
  const [items, setItems] = useState<GiftItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  const showToast = useCustomToast()

  const fetchInventory = useCallback(async () => {
    // Если уже идет загрузка, можно не запускать повторно (опционально, но полезно)
    // Но в данном случае важнее исправить зависимости.

    setIsLoading(true)
    setIsError(false)
    try {
      const data = await InventoryService.getItems()
      setItems(data)
    } catch (error) {
      console.error(error)
      setIsError(true)
      showToast({
        title: "Failed to load inventory",
        status: "error",
      })
    } finally {
      setIsLoading(false)
    }
    // Убираем showToast из массива зависимостей, чтобы избежать циклов
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchInventory()
  }, [fetchInventory])

  return {
    items,
    isLoading,
    isError,
    refetch: fetchInventory,
  }
}
