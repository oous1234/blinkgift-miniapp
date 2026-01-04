import React, { useState, useMemo } from "react"
import {
  Box,
  SimpleGrid,
  Flex,
  Spinner,
  Center,
  Text,
  Icon,
  Badge,
  VStack,
  Collapse,
  useDisclosure,
} from "@chakra-ui/react"
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"

// Hooks
import { useInventory } from "./hooks/useInventory"
import { useOwnerProfile } from "./hooks/useOwnerProfile"

// Components
import { NetWorthCard } from "@components/Home/NetWorthCard"
import { GiftCard } from "@components/Home/GiftCard"
import { Pagination } from "@components/Home/Pagination"
import { PortfolioChart } from "@components/Home/PortfolioChart"
import BottomNavigation from "@components/navigation/BottomNavigation"
import GiftDetailDrawer from "@components/overlay/GiftDetailDrawer"

// Types
import { GiftItem } from "../../types/inventory"

const ProfilePage: React.FC = () => {
  // Значения должны совпадать с ключами JSON: "12h", "24h", "7d", "30d"
  const [chartPeriod, setChartPeriod] = useState<string>("30d")
  const { isOpen: isStatsOpen, onToggle: onToggleStats } = useDisclosure()

  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure()

  const { items, totalCount, currentPage, limit, setPage } = useInventory()
  const { ownerData, isLoading } = useOwnerProfile()

  // ИСПРАВЛЕНИЕ: Берем данные напрямую из cap по ключу периода
  const currentChartPoints = useMemo(() => {
    if (!ownerData?.cap) return []
    // ownerData.cap["30d"] и т.д.
    const points = (ownerData.cap as any)[chartPeriod]
    return points || []
  }, [ownerData, chartPeriod])

  const analytics = useMemo(() => {
    const points = currentChartPoints
    if (points.length === 0) return { current: 0, pnl: 0, percent: 0 }

    const firstPoint = points[0].average.ton
    const lastPoint = points[points.length - 1].average.ton

    const pnl = lastPoint - firstPoint
    const percent = firstPoint > 0 ? (pnl / firstPoint) * 100 : 0

    return {
      current: lastPoint,
      pnl: pnl,
      percent: percent,
    }
  }, [currentChartPoints])

  const handleGiftClick = (gift: GiftItem) => {
    setSelectedGift(gift)
    onDetailOpen()
  }

  if (isLoading && !ownerData) {
    return (
      <Center minH="100vh" bg="#0F1115">
        <Spinner size="lg" color="#e8d7fd" thickness="3px" />
      </Center>
    )
  }

  return (
    <Box minH="100vh" bg="#0F1115" color="white" pb="120px" px="16px" pt="8px">
      <NetWorthCard totalValue={analytics.current} pnlPercent={analytics.percent} />

      <Box
        as="button"
        onClick={onToggleStats}
        w="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bg="rgba(255, 255, 255, 0.04)"
        py="14px"
        px="20px"
        borderRadius="16px"
        mb={6}
        _active={{ bg: "rgba(255, 255, 255, 0.08)", transform: "scale(0.98)" }}
      >
        <Text fontSize="14px" fontWeight="600">
          Аналитика портфеля ({chartPeriod})
        </Text>
        <Icon as={isStatsOpen ? ChevronUpIcon : ChevronDownIcon} color="gray.500" w={5} h={5} />
      </Box>

      <Collapse in={isStatsOpen} animateOpacity>
        <Box mb={8}>
          <StatisticsView
            totalValue={analytics.current}
            itemCount={totalCount}
            historyData={currentChartPoints}
            selectedPeriod={chartPeriod}
            onPeriodChange={setChartPeriod}
          />
        </Box>
      </Collapse>

      <Flex align="center" justify="space-between" mb={4} px={1}>
        <Text fontSize="18px" fontWeight="700">
          Мои подарки
        </Text>
        <Badge
          bg="#e8d7fd"
          color="#0F1115"
          px="12px"
          py="3px"
          borderRadius="100px"
          fontSize="11px"
          fontWeight="800"
        >
          {totalCount} шт.
        </Badge>
      </Flex>

      {items.length === 0 ? (
        <Center py={20} opacity={0.5}>
          <Text fontSize="14px">В вашем инвентаре пока нет подарков</Text>
        </Center>
      ) : (
        <Box>
          <SimpleGrid columns={2} spacing="12px" mb={8}>
            {items.map((item) => (
              <GiftCard key={item.id} item={item} onClick={() => handleGiftClick(item)} />
            ))}
          </SimpleGrid>
          <Pagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={limit}
            onPageChange={setPage}
          />
        </Box>
      )}

      <GiftDetailDrawer isOpen={isDetailOpen} onClose={onDetailClose} gift={selectedGift} />
      <BottomNavigation />
    </Box>
  )
}

const StatisticsView = ({
  totalValue,
  itemCount,
  historyData,
  selectedPeriod,
  onPeriodChange,
}: any) => (
  <Box
    bg="rgba(255, 255, 255, 0.02)"
    borderRadius="24px"
    p="20px"
    border="1px solid rgba(255, 255, 255, 0.05)"
  >
    <PortfolioChart
      historyData={historyData}
      selectedPeriod={selectedPeriod}
      onPeriodChange={onPeriodChange}
    />
    <VStack align="stretch" spacing={0} mt={2}>
      <StatRow
        label="Текущая оценка"
        value={`${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })} TON`}
        isAccent
      />
      <StatRow label="Количество предметов" value={`${itemCount} шт.`} />
    </VStack>
  </Box>
)

const StatRow = ({ label, value, isAccent }: any) => (
  <Flex
    justify="space-between"
    py="12px"
    borderBottom="1px solid"
    borderColor="whiteAlpha.50"
    _last={{ border: "none" }}
  >
    <Text color="gray.500" fontSize="11px" fontWeight="600" textTransform="uppercase">
      {label}
    </Text>
    <Text fontSize="13px" fontWeight="700" color={isAccent ? "#e8d7fd" : "white"}>
      {value}
    </Text>
  </Flex>
)

export default ProfilePage
