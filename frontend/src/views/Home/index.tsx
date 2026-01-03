// frontend/src/views/Home/index.tsx
import React, { useState, useMemo } from "react"
import {
  Box,
  SimpleGrid,
  Flex,
  Spinner,
  Center,
  Text,
  Button,
  Collapse,
  useDisclosure,
  Icon
} from "@chakra-ui/react"
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import { useInventory } from "./hooks/useInventory"
import { useOwnerProfile } from "./hooks/useOwnerProfile"
import { NetWorthCard } from "@components/Home/NetWorthCard"
import { GiftCard } from "@components/Home/GiftCard"
import BottomNavigation from "@components/navigation/BottomNavigation"
import { Pagination } from "@components/Home/Pagination"
import { PortfolioChart } from "@components/Home/PortfolioChart"
import { PortfolioHistory } from "../../types/owner"

const ProfilePage: React.FC = () => {
  // Состояние для периода графика
  const [chartPeriod, setChartPeriod] = useState<keyof PortfolioHistory>("24h")

  // Хук для управления сворачиванием статистики
  const { isOpen: isStatsOpen, onToggle: onToggleStats } = useDisclosure()

  const {
    items,
    totalCount,
    currentPage,
    limit,
    isError: isInventoryError,
    refetch: refetchInventory,
    setPage
  } = useInventory()

  const {
    ownerData,
    isLoading: isOwnerLoading,
    isError: isOwnerError,
    refetch: refetchOwner
  } = useOwnerProfile()

  const portalsValue = ownerData?.portfolio_value?.average?.ton || ownerData?.portfolio_value?.portals?.ton || 0

  const pnlData = useMemo(() => {
    if (!ownerData?.portfolio_history?.[chartPeriod]) return { pnl: 0, percent: 0 }
    const history = ownerData.portfolio_history[chartPeriod]
    if (history.length < 2) return { pnl: 0, percent: 0 }
    const firstPrice = history[0].average.ton
    const lastPrice = portalsValue
    const pnl = lastPrice - firstPrice
    const percent = firstPrice > 0 ? (pnl / firstPrice) * 100 : 0
    return { pnl, percent }
  }, [ownerData, chartPeriod, portalsValue])

  if (isOwnerLoading) {
    return (
      <Center minH="100vh" bg="#0F1115" flexDirection="column" gap={4}>
        <Spinner size="xl" color="blue.400" thickness="4px" speed="0.65s" />
        <Text color="gray.500" fontSize="sm">Loading profile...</Text>
      </Center>
    )
  }

  if ((isInventoryError && items.length === 0) || isOwnerError) {
    return (
      <Center minH="100vh" bg="#0F1115" flexDirection="column" gap={4}>
        <Text color="red.400">Connection failed</Text>
        <Button onClick={() => { refetchInventory(); refetchOwner(); }} size="sm" colorScheme="blue" variant="outline">
          Try Again
        </Button>
      </Center>
    )
  }

  return (
    <Box minH="100vh" bg="#0F1115" color="white" pb="120px" px="16px" pt="16px">
      {/* 1. Главная карточка баланса */}
      <NetWorthCard
        totalValue={portalsValue}
        totalPnL={pnlData.pnl}
        pnlPercent={pnlData.percent}
        bestPerformer={{ name: "Total Portfolio", profit: pnlData.pnl }}
      />

      {/* 2. Кнопка для развертывания графиков и статистики */}
      <Flex justify="center" mb={4}>
        <Button
          onClick={onToggleStats}
          variant="ghost"
          size="sm"
          color="gray.400"
          _hover={{ color: "white", bg: "whiteAlpha.100" }}
          rightIcon={isStatsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        >
          {isStatsOpen ? "Hide Analytics" : "Show Analytics"}
        </Button>
      </Flex>

      {/* 3. Сворачиваемая секция аналитики */}
      <Collapse in={isStatsOpen} animateOpacity>
        <Box mb={6}>
          <StatisticsView
            totalValue={portalsValue}
            itemCount={ownerData?.gifts_count || totalCount}
            history={ownerData?.portfolio_history}
            selectedPeriod={chartPeriod}
            onPeriodChange={setChartPeriod}
          />
        </Box>
      </Collapse>

      {/* 4. Заголовок секции подарков */}
      <Flex align="center" justify="space-between" mb={4} px={1}>
        <Text fontSize="18px" fontWeight="700">
          My Gifts
        </Text>
        <Box bg="whiteAlpha.100" px="8px" py="2px" borderRadius="6px" fontSize="12px" color="gray.400">
          {ownerData?.gifts_count || totalCount} items
        </Box>
      </Flex>

      {/* 5. Сетка подарков */}
      {items.length === 0 ? (
        <Center py={10} flexDirection="column" opacity={0.6}>
          <Text fontSize="40px" mb={2}>🎁</Text>
          <Text>No gifts found</Text>
        </Center>
      ) : (
        <Box>
          <SimpleGrid columns={2} spacing="12px" mb={6}>
            {items.map((item) => (
              <GiftCard key={item.id} item={item} />
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

      <BottomNavigation />
    </Box>
  )
}

// StatisticsView теперь более компактный
const StatisticsView = ({
                          totalValue,
                          itemCount,
                          history,
                          selectedPeriod,
                          onPeriodChange,
                        }: {
  totalValue: number
  itemCount: number
  history?: PortfolioHistory
  selectedPeriod: keyof PortfolioHistory
  onPeriodChange: (p: keyof PortfolioHistory) => void
}) => (
  <Box
    bg="rgba(22, 25, 32, 0.6)"
    borderRadius="24px"
    p="20px"
    border="1px solid"
    borderColor="whiteAlpha.100"
    backdropFilter="blur(10px)"
  >
    {history && (
      <PortfolioChart
        history={history}
        selectedPeriod={selectedPeriod}
        onPeriodChange={onPeriodChange}
      />
    )}

    <Flex direction="column" gap="0" mt={2}>
      <StatRow
        label="Est. Value"
        value={`${totalValue.toLocaleString()} TON`}
        highlight
      />
      <StatRow label="Items" value={itemCount} />
      <StatRow label="Sources" value="Fragment / GetGems" />
    </Flex>
  </Box>
)

const StatRow = ({ label, value, highlight }: any) => (
  <Flex justify="space-between" py="10px" borderBottom="1px solid" borderColor="whiteAlpha.50" _last={{ border: "none" }}>
    <Text color="gray.400" fontSize="12px">{label}</Text>
    <Text fontSize="13px" fontWeight="600" color={highlight ? "blue.400" : "white"}>{value}</Text>
  </Flex>
)

export default ProfilePage