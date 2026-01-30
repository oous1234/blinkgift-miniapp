import { useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import { useDisclosure } from "@chakra-ui/react"
import { useInventory } from "./useInventory"
import { useOwnerProfile } from "./useOwnerProfile"
import InventoryService from "@services/inventory"
import { GiftItem } from "../../../types"

export const useHomeLogic = () => {
  const { id: ownerId } = useParams<{ id: string }>()
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [isDetailError, setIsDetailError] = useState(false)
  const [chartPeriod, setChartPeriod] = useState("30d")

  const detailDisclosure = useDisclosure()
  const statsDisclosure = useDisclosure()
  const searchDisclosure = useDisclosure()

  const { items, totalCount, currentPage, limit, setPage, isLoading: isInvLoading } = useInventory(ownerId)
  const { historyData, isLoading: isChartLoading } = useOwnerProfile(chartPeriod, ownerId)

  // Исправленный расчет аналитики
  const analytics = useMemo(() => {
    const points = historyData || []
    if (points.length < 2) {
      return { current: 0, pnl: 0, percent: 0, tonPrice: 5.4 }
    }

    const firstPoint = points[0].average.ton
    const lastPoint = points[points.length - 1].average.ton
    const pnl = lastPoint - firstPoint
    const percent = firstPoint > 0 ? (pnl / firstPoint) * 100 : 0

    return {
      current: lastPoint,
      pnl,
      percent,
      tonPrice: 5.4
    }
  }, [historyData])

  const handleGiftClick = async (gift: any) => {
    setSelectedGift(null)
    setIsDetailError(false)
    setIsDetailLoading(true)
    detailDisclosure.onOpen()

    try {
      // Используем новый метод сервиса
      const detailedGift = await InventoryService.getGiftDetail(gift.slug, gift.num)
      setSelectedGift(detailedGift)
    } catch (error) {
      console.error("Detail load error:", error)
      setIsDetailError(true)
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
    isDetailError,
    handleGiftClick,
    detailDisclosure,
    statsDisclosure,
    searchDisclosure,
    historyData,
    isChartLoading,
    isInvLoading,
    chartPeriod,
    setChartPeriod,
    isVisitorMode: !!ownerId,
  }
}