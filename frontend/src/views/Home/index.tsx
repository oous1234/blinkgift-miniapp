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
  // Период графика
  const [chartPeriod, setChartPeriod] = useState<string>("24h")
  const { isOpen: isStatsOpen, onToggle: onToggleStats } = useDisclosure()

  // Деталка подарка
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure()

  // Данные инвентаря
  const { items, totalCount, currentPage, limit, setPage } = useInventory()

  // Данные истории (подгружаются при смене chartPeriod)
  const { ownerData: historyData, isLoading } = useOwnerProfile(chartPeriod)

  // Вычисляем аналитику: берем первую и последнюю точку из пришедшего массива
  const analytics = useMemo(() => {
    const points = historyData?.data || []
    if (points.length === 0) return { current: 0, pnl: 0, percent: 0 }

    const firstPoint = points[0].average.ton
    const lastPoint = points[points.length - 1].average.ton

    const pnl = lastPoint - firstPoint
    const percent = firstPoint > 0 ? (pnl / firstPoint) * 100 : 0

    return {
      current: lastPoint,
      pnl: pnl,
      percent: percent
    }
  }, [historyData])

  const handleGiftClick = (gift: GiftItem) => {
    setSelectedGift(gift)
    onDetailOpen()
  }

  // Если данных еще нет совсем, показываем лоадер
  if (isLoading && !historyData) {
    return (
      <Center minH="100vh" bg="#0F1115">
        <Spinner size="lg" color="#e8d7fd" thickness="3px" />
      </Center>
    )
  }

  return (
    <Box minH="100vh" bg="#0F1115" color="white" pb="120px" px="16px" pt="8px">
      {/* 1. Карточка стоимости (динамически из последней точки истории) */}
      <NetWorthCard totalValue={analytics.current} pnlPercent={analytics.percent} />

      {/* 2. Кнопка аналитики */}
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
        transition="all 0.2s"
        _active={{ bg: "rgba(255, 255, 255, 0.08)", transform: "scale(0.98)" }}
      >
        <Text fontSize="14px" fontWeight="600" color="white">
          Аналитика портфеля ({chartPeriod})
        </Text>
        <Icon as={isStatsOpen ? ChevronUpIcon : ChevronDownIcon} color="gray.500" w={5} h={5} />
      </Box>

      {/* 3. График */}
      <Collapse in={isStatsOpen} animateOpacity>
        <Box mb={8} position="relative">
          {isLoading && (
            <Spinner size="xs" position="absolute" top="10px" right="10px" color="#e8d7fd" />
          )}
          <StatisticsView
            totalValue={analytics.current}
            itemCount={totalCount}
            history={historyData}
            selectedPeriod={chartPeriod}
            onPeriodChange={setChartPeriod}
          />
        </Box>
      </Collapse>

      {/* 4. Инвентарь */}
      <Flex align="center" justify="space-between" mb={4} px={1}>
        <Text fontSize="18px" fontWeight="700">Мои подарки</Text>
        <Badge bg="#e8d7fd" color="#0F1115" px="12px" py="3px" borderRadius="100px" fontSize="11px" fontWeight="800">
          {totalCount} шт.
        </Badge>
      </Flex>

      {items.length === 0 ? (
        <Center py={20} opacity={0.5} flexDirection="column">
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

const StatisticsView = ({ totalValue, itemCount, history, selectedPeriod, onPeriodChange }: any) => (
  <Box bg="rgba(255, 255, 255, 0.02)" borderRadius="24px" p="20px" border="1px solid rgba(255, 255, 255, 0.05)">
    <PortfolioChart
      history={history}
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
  <Flex justify="space-between" py="12px" borderBottom="1px solid" borderColor="whiteAlpha.50" _last={{ border: "none" }}>
    <Text color="gray.500" fontSize="11px" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px">
      {label}
    </Text>
    <Text fontSize="13px" fontWeight="700" color={isAccent ? "#e8d7fd" : "white"}>{value}</Text>
  </Flex>
)

export default ProfilePage