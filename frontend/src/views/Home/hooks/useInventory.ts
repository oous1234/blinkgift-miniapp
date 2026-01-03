import { useState, useEffect } from "react"
import InventoryService from "@services/inventory"
import { GiftItem } from "../../../types/inventory"
import { useCustomToast } from "@helpers/toastUtil"

export const useInventory = () => {
  const [items, setItems] = useState<GiftItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  const showToast = useCustomToast()

  const fetchInventory = async () => {
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
  }

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchInventory()
  }, [])

  return {
    items,
    isLoading,
    isError,
    refetch: fetchInventory, // Полезно для pull-to-refresh
  }
}
