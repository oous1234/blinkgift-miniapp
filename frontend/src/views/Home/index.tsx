import React, { useState, useMemo, useEffect } from "react"
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
  // 1. Состояние периода (по умолчанию 30 дней)
  const [chartPeriod, setChartPeriod] = useState<string>("30d")

  // 2. Управление открытием детальной инфы подарка
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure()

  // 3. Управление секцией статистики
  const { isOpen: isStatsOpen, onToggle: onToggleStats } = useDisclosure()

  // 4. Загрузка инвентаря
  const {
    items,
    totalCount,
    currentPage,
    limit,
    setPage,
    isLoading: isInventoryLoading,
  } = useInventory()

  // 5. Загрузка данных профиля/графика (хук теперь принимает период)
  const { historyData, isLoading: isChartLoading } = useOwnerProfile(chartPeriod)

  // Получаем точки именно для выбранного периода из пришедшего объекта
  const currentChartPoints = useMemo(() => {
    if (!historyData) return []
    return (historyData as any)[chartPeriod] || []
  }, [historyData, chartPeriod])

  // Расчет аналитики (текущая цена и PnL) на основе данных графика
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

  return (
    <Box minH="100vh" bg="#0F1115" color="white" pb="120px" px="16px" pt="8px">
      {/* Карточка баланса (общая стоимость) */}
      <Skeleton isLoaded={!isChartLoading} borderRadius="24px" fadeDuration={1}>
        <NetWorthCard totalValue={analytics.current} pnlPercent={analytics.percent} />
      </Skeleton>

      {/* Кнопка раскрытия аналитики */}
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

      {/* Секция с графиком */}
      <Collapse in={isStatsOpen} animateOpacity>
        <Box mb={8}>
          <Box
            bg="rgba(255, 255, 255, 0.02)"
            borderRadius="24px"
            p="20px"
            border="1px solid rgba(255, 255, 255, 0.05)"
            position="relative"
          >
            {/* Если данные загружаются, поверх графика можно показать спиннер или использовать Skeleton */}
            {isChartLoading && (
              <Center
                position="absolute"
                inset={0}
                zIndex={10}
                bg="rgba(15,17,21,0.6)"
                borderRadius="24px"
              >
                <Spinner color="#e8d7fd" />
              </Center>
            )}

            <PortfolioChart
              historyData={currentChartPoints}
              selectedPeriod={chartPeriod}
              onPeriodChange={setChartPeriod} // Смена периода здесь триггерит перезагрузку в хуке
            />

            <VStack align="stretch" spacing={0} mt={4}>
              <StatRow
                label="Текущая оценка"
                value={`${analytics.current.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })} TON`}
                isAccent
              />
              <StatRow label="Всего предметов" value={`${totalCount} шт.`} />
            </VStack>
          </Box>
        </Box>
      </Collapse>

      {/* Заголовок инвентаря */}
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

      {/* Сетка подарков */}
      {isInventoryLoading && items.length === 0 ? (
        <Center py={10}>
          <Spinner color="#e8d7fd" />
        </Center>
      ) : items.length === 0 ? (
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

      {/* Оверлеи */}
      <GiftDetailDrawer isOpen={isDetailOpen} onClose={onDetailClose} gift={selectedGift} />
      <BottomNavigation />
    </Box>
  )
}

// Вспомогательный компонент для строк статистики
const StatRow = ({
  label,
  value,
  isAccent,
}: {
  label: string
  value: string
  isAccent?: boolean
}) => (
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
