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
  const [isDetailError, setIsDetailError] = useState<boolean>(false)
  const [chartPeriod, setChartPeriod] = useState<string>("30d")

  const detailDisclosure = useDisclosure()
  const statsDisclosure = useDisclosure()
  const searchDisclosure = useDisclosure()

  const {
    items,
    totalCount,
    currentPage,
    limit,
    setPage,
    isLoading: isInvLoading,
  } = useInventory(ownerId)
  const { historyData, isLoading: isChartLoading } = useOwnerProfile(chartPeriod, ownerId)

  const analytics = useMemo(() => {
    const points = historyData?.data || []
    if (points.length < 2) return { current: 0, pnl: 0, percent: 0, tonPrice: 5.4 }
    const last = points[points.length - 1].average.ton
    const first = points[0].average.ton
    const pnl = last - first
    return { current: last, pnl, percent: first > 0 ? (pnl / first) * 100 : 0, tonPrice: 5.4 }
  }, [historyData])

  const handleGiftClick = async (gift: any) => {
    setSelectedGift(null)
    setIsDetailError(false)
    setIsDetailLoading(true)
    detailDisclosure.onOpen()

    try {
      // Генерируем slug из имени и номера: Trapped Heart #8442 -> TrappedHeart-8442
      const slugBase = gift.name.replace(/\s+/g, "")
      const fullSlug = `${slugBase}-${gift.num}`

      const detailedGift = await InventoryService.getGiftDetail(fullSlug)
      setSelectedGift(detailedGift)
    } catch (error) {
      console.error("API Fetch Error:", error)
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
    isVisitorMode: !!routeUserId,
  }
}
