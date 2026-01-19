// src/views/Home/hooks/useHomeLogic.ts
import { useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import { useDisclosure } from "@chakra-ui/react"
import { useInventory } from "./useInventory"
import { useOwnerProfile } from "./useOwnerProfile"
import { GiftItem } from "../../../types/inventory"

export const useHomeLogic = () => {
  const { id: routeUserId } = useParams<{ id: string }>()
  const ownerId = routeUserId
  const isVisitorMode = !!routeUserId

  const [chartPeriod, setChartPeriod] = useState<string>("30d")
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)

  // Drawer states
  const statsDisclosure = useDisclosure()
  const detailDisclosure = useDisclosure()
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

  // Централизованная аналитика
  const analytics = useMemo(() => {
    const points = historyData?.data || []
    if (points.length < 2) return { current: 0, pnl: 0, percent: 0 }

    const first = points[0].average.ton
    const last = points[points.length - 1].average.ton
    const pnl = last - first

    return {
      current: last,
      pnl,
      percent: first > 0 ? (pnl / first) * 100 : 0,
      tonPrice: 5.4, // В будущем это будет приходить из API
    }
  }, [historyData])

  const handleGiftClick = (gift: GiftItem) => {
    setSelectedGift(gift)
    detailDisclosure.onOpen()
  }

  return {
    ownerId,
    isVisitorMode,
    items,
    totalCount,
    currentPage,
    limit,
    setPage,
    analytics,
    chartPeriod,
    setChartPeriod,
    selectedGift,
    isChartLoading,
    isInvLoading,
    handleGiftClick,
    statsDisclosure,
    detailDisclosure,
    searchDisclosure,
    historyData,
  }
}
