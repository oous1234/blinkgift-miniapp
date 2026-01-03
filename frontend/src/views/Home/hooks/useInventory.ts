// frontend/src/views/Home/hooks/useInventory.ts
import { useState, useEffect, useCallback } from "react"
import InventoryService from "@services/inventory"
import { GiftItem } from "../../../types/inventory"
import { useCustomToast } from "@helpers/toastUtil"

const PAGE_LIMIT = 1

export const useInventory = () => {
  const [items, setItems] = useState<GiftItem[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  const showToast = useCustomToast()

  const fetchInventory = useCallback(async (page: number) => {
    setIsLoading(true)
    setIsError(false)

    // Рассчитываем offset
    const offset = (page - 1) * PAGE_LIMIT

    try {
      const data = await InventoryService.getItems(PAGE_LIMIT, offset)
      setItems(data.items)
      setTotalCount(data.total)
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
  }, []) // Зависимости пусты, так как offset считается внутри

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
    limit: PAGE_LIMIT,
    isLoading,
    isError,
    refetch: () => fetchInventory(currentPage),
    setPage: handlePageChange,
  }
}
