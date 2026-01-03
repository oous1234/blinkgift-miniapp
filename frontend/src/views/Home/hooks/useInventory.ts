// frontend/src/views/Home/hooks/useInventory.ts
import { useState, useEffect, useCallback } from "react"
import InventoryService from "@services/inventory"
import { GiftItem } from "../../../types/inventory"
import { useCustomToast } from "@helpers/toastUtil"

const PAGE_LIMIT = 10

export const useInventory = () => {
  const [items, setItems] = useState<GiftItem[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(PAGE_LIMIT)
  const [offset, setOffset] = useState<number>(0)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  const showToast = useCustomToast()

  const fetchInventory = useCallback(async (page: number) => {
    setIsLoading(true)
    setIsError(false)

    // Рассчитываем offset
    const newOffset = (page - 1) * PAGE_LIMIT

    try {
      const data = await InventoryService.getItems(PAGE_LIMIT, newOffset)

      setItems(data.items)
      setTotalCount(data.total)
      setLimit(data.limit)
      setOffset(data.offset)

      // Для отладки - можно посмотреть, что приходит с бекенда
      console.log("Inventory data received:", {
        itemsCount: data.items.length,
        total: data.total,
        limit: data.limit,
        offset: data.offset,
        page,
      })
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
  }, [])

  // Эффект срабатывает при изменении currentPage
  useEffect(() => {
    fetchInventory(currentPage)
  }, [fetchInventory, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Скролл наверх при смене страницы
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
