import { useState, useEffect, useCallback } from "react"
import InventoryService from "@services/inventory"
import { GiftItem } from "../../../types/inventory"
import { useCustomToast } from "@helpers/toastUtil"

const PAGE_LIMIT = 10

// Добавляем аргумент customOwnerId
export const useInventory = (customOwnerId?: string) => {
  const [items, setItems] = useState<GiftItem[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(PAGE_LIMIT)
  const [offset, setOffset] = useState<number>(0)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  const showToast = useCustomToast()

  const fetchInventory = useCallback(
    async (page: number) => {
      setIsLoading(true)
      setIsError(false)

      const newOffset = (page - 1) * PAGE_LIMIT

      try {
        // Передаем customOwnerId в сервис
        const data = await InventoryService.getItems(PAGE_LIMIT, newOffset, customOwnerId)

        setItems(data.items)
        setTotalCount(data.total)
        setLimit(data.limit)
        setOffset(data.offset)
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
    },
    [customOwnerId, showToast]
  ) // Добавляем customOwnerId в зависимости

  useEffect(() => {
    fetchInventory(currentPage)
  }, [fetchInventory, currentPage])

  // Сброс страницы при смене пользователя
  useEffect(() => {
    setCurrentPage(1)
  }, [customOwnerId])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return {
    items,
    totalCount,
    currentPage,
    limit,
    offset,
    isLoading,
    isError,
    refetch: () => fetchInventory(currentPage),
    setPage: handlePageChange,
  }
}
