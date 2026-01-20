// frontend/src/views/Home/hooks/useHomeLogic.ts
import { useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import { useDisclosure } from "@chakra-ui/react"
import { useInventory } from "./useInventory"
import { useOwnerProfile } from "./useOwnerProfile"
import { GiftItem } from "../../../types/inventory"
import InventoryService from "../../../services/inventory"

export const useHomeLogic = () => {
  const { id: routeUserId } = useParams<{ id: string }>()
  const ownerId = routeUserId

  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false)
  const [isDetailError, setIsDetailError] = useState<boolean>(false) // Новое состояние ошибки

  const detailDisclosure = useDisclosure()
  const statsDisclosure = useDisclosure()
  const searchDisclosure = useDisclosure()

  const { items, totalCount, currentPage, limit, setPage, isLoading: isInvLoading } = useInventory(ownerId)
  const { historyData, isLoading: isChartLoading } = useOwnerProfile("30d", ownerId)

  const analytics = useMemo(() => {
    const points = historyData?.data || []
    if (points.length < 2) return { current: 0, pnl: 0, percent: 0, tonPrice: 5.4 }
    const last = points[points.length - 1].average.ton
    const first = points[0].average.ton
    const pnl = last - first
    return { current: last, pnl, percent: first > 0 ? (pnl / first) * 100 : 0, tonPrice: 5.4 }
  }, [historyData])

  const handleGiftClick = async (gift: GiftItem) => {
    // Сброс состояний перед новым запросом
    setSelectedGift(null)
    setIsDetailError(false)
    setIsDetailLoading(true)

    // Открываем шторку сразу
    detailDisclosure.onOpen()

    try {
      const detailedGift = await InventoryService.getGiftDetail(gift.id)
      setSelectedGift(detailedGift)
    } catch (error) {
      console.error("API Fetch Error:", error)
      setIsDetailError(true) // Фиксируем ошибку
    } finally {
      setIsDetailLoading(false)
    }
  }

  return {
    items,
    totalCount,
    currentPage,
    limit,
    setPage,
    analytics,
    selectedGift,
    isDetailLoading,
    isDetailError, // Пробрасываем ошибку в UI
    handleGiftClick,
    detailDisclosure,
    statsDisclosure,
    searchDisclosure,
    historyData,
    isChartLoading,
    isInvLoading,
    isVisitorMode: !!routeUserId
  }
}