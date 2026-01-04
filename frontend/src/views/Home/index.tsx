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
  Skeleton,
} from "@chakra-ui/react"
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"

import { useInventory } from "./hooks/useInventory"
import { useOwnerProfile } from "./hooks/useOwnerProfile"
import { NetWorthCard } from "@components/Home/NetWorthCard"
import { GiftCard } from "@components/Home/GiftCard"
import { Pagination } from "@components/Home/Pagination"
import { PortfolioChart } from "@components/Home/PortfolioChart"
import BottomNavigation from "@components/navigation/BottomNavigation"
import GiftDetailDrawer from "@components/overlay/GiftDetailDrawer"
import { GiftItem } from "../../types/inventory"

const ProfilePage: React.FC = () => {
  const [chartPeriod, setChartPeriod] = useState<string>("30d")
  const { isOpen: isStatsOpen, onToggle: onToggleStats } = useDisclosure()
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure()

  const { items, totalCount, currentPage, limit, setPage } = useInventory()

  // Хук теперь возвращает массив точек для конкретного периода
  const { historyData, isLoading: isChartLoading } = useOwnerProfile(chartPeriod)

  // Данные для графика — это теперь напрямую результат из API
  const currentChartPoints = useMemo(() => {
    return historyData || []
  }, [historyData])

  const analytics = useMemo(() => {
    const points = currentChartPoints
    if (points.length < 2) return { current: 0, pnl: 0, percent: 0 }

    const firstPoint = points[0].average.ton
    const lastPoint = points[points.length - 1].average.ton
    const pnl = lastPoint - firstPoint
    const percent = firstPoint > 0 ? (pnl / firstPoint) * 100 : 0

    return { current: lastPoint, pnl, percent }
  }, [currentChartPoints])

  const handleGiftClick = (gift: GiftItem) => {
    setSelectedGift(gift)
    onDetailOpen()
  }

  return (
    <Box minH="100vh" bg="#0F1115" color="white" pb="120px" px="16px" pt="8px">

      {/* Скелетон для карточки баланса */}
      <Skeleton isLoaded={!isChartLoading || currentChartPoints.length > 0} borderRadius="24px">
        <NetWorthCard totalValue={analytics.current} pnlPercent={analytics.percent} />
      </Skeleton>

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
      >
        <Text fontSize="14px" fontWeight="600">Аналитика портфеля ({chartPeriod})</Text>
        <Icon as={isStatsOpen ? ChevronUpIcon : ChevronDownIcon} color="gray.500" w={5} h={5} />
      </Box>

      <Collapse in={isStatsOpen} animateOpacity>
        <Box mb={8} position="relative">
          <Box
            bg="rgba(255, 255, 255, 0.02)"
            borderRadius="24px"
            p="20px"
            border="1px solid rgba(255, 255, 255, 0.05)"
          >
            {/* Спиннер поверх графика при смене периода */}
            {isChartLoading && (
              <Center position="absolute" inset={0} zIndex={2} bg="rgba(15,17,21,0.7)" borderRadius="24px">
                <Spinner color="#e8d7fd" />
              </Center>
            )}

            <PortfolioChart
              historyData={currentChartPoints}
              selectedPeriod={chartPeriod}
              onPeriodChange={setChartPeriod} // При нажатии на 12h/7d меняется период и летит новый запрос
            />

            <VStack align="stretch" spacing={0} mt={4}>
              <StatRow
                label="Текущая оценка"
                value={`${analytics.current.toLocaleString(undefined, { minimumFractionDigits: 2 })} TON`}
                isAccent
              />
              <StatRow label="Предметов в коллекции" value={`${totalCount} шт.`} />
            </VStack>
          </Box>
        </Box>
      </Collapse>

      <Flex align="center" justify="space-between" mb={4}>
        <Text fontSize="18px" fontWeight="700">Мои подарки</Text>
        <Badge bg="#e8d7fd" color="#0F1115" px="12px" py="3px" borderRadius="100px">{totalCount} шт.</Badge>
      </Flex>

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

      <GiftDetailDrawer isOpen={isDetailOpen} onClose={onDetailClose} gift={selectedGift} />
      <BottomNavigation />
    </Box>
  )
}

const StatRow = ({ label, value, isAccent }: any) => (
  <Flex justify="space-between" py="12px" borderBottom="1px solid" borderColor="whiteAlpha.50" _last={{ border: "none" }}>
    <Text color="gray.500" fontSize="11px" fontWeight="600" textTransform="uppercase">{label}</Text>
    <Text fontSize="13px" fontWeight="700" color={isAccent ? "#e8d7fd" : "white"}>{value}</Text>
  </Flex>
)

export default ProfilePage