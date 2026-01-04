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
import { PortfolioHistory } from "../../types/owner"
import { GiftItem } from "../../types/inventory"

const ProfilePage: React.FC = () => {
  // Состояния для аналитики
  const [chartPeriod, setChartPeriod] = useState<keyof PortfolioHistory>("24h")
  const { isOpen: isStatsOpen, onToggle: onToggleStats } = useDisclosure()

  // Состояния для детальной информации о подарке
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure()

  // Получение данных через кастомные хуки
  const { items, totalCount, currentPage, limit, setPage } = useInventory()
  const { ownerData, isLoading } = useOwnerProfile()

  // Расчет стоимости и PnL
  const portalsValue = ownerData?.portfolio_value?.average?.ton || 0

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

  // Обработчик клика по карточке подарка
  const handleGiftClick = (gift: GiftItem) => {
    setSelectedGift(gift)
    onDetailOpen()
  }

  if (isLoading) {
    return (
      <Center minH="100vh" bg="#0F1115">
        <Spinner size="lg" color="#e8d7fd" thickness="3px" />
      </Center>
    )
  }

  return (
    <Box minH="100vh" bg="#0F1115" color="white" pb="120px" px="16px" pt="8px">
      {/* 1. Карточка общей стоимости */}
      <NetWorthCard totalValue={portalsValue} pnlPercent={pnlData.percent} />

      {/* 2. Кнопка раскрытия аналитики */}
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
          Аналитика портфеля
        </Text>
        <Icon as={isStatsOpen ? ChevronUpIcon : ChevronDownIcon} color="gray.500" w={5} h={5} />
      </Box>

      {/* 3. Секция графиков (разворачивающаяся) */}
      <Collapse in={isStatsOpen} animateOpacity>
        <Box mb={8}>
          <StatisticsView
            totalValue={portalsValue}
            itemCount={ownerData?.gifts_count || totalCount}
            history={ownerData?.portfolio_history}
            selectedPeriod={chartPeriod}
            onPeriodChange={setChartPeriod}
          />
        </Box>
      </Collapse>

      {/* 4. Заголовок секции инвентаря */}
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
          {ownerData?.gifts_count || totalCount} шт.
        </Badge>
      </Flex>

      {/* 5. Сетка подарков */}
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

      {/* 6. Оверлеи и Навигация */}
      <GiftDetailDrawer isOpen={isDetailOpen} onClose={onDetailClose} gift={selectedGift} />

      <BottomNavigation />
    </Box>
  )
}

/**
 * Вспомогательный компонент для отображения статистики и графиков
 */
const StatisticsView = ({
  totalValue,
  itemCount,
  history,
  selectedPeriod,
  onPeriodChange,
}: any) => (
  <Box
    bg="rgba(255, 255, 255, 0.02)"
    borderRadius="24px"
    p="20px"
    border="1px solid rgba(255, 255, 255, 0.05)"
  >
    {history && (
      <PortfolioChart
        history={history}
        selectedPeriod={selectedPeriod}
        onPeriodChange={onPeriodChange}
      />
    )}
    <VStack align="stretch" spacing={0} mt={2}>
      <StatRow
        label="Рыночная оценка"
        value={`${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })} TON`}
        isAccent
      />
      <StatRow label="Количество NFT" value={`${itemCount} шт.`} />
    </VStack>
  </Box>
)

/**
 * Строка данных в блоке статистики
 */
const StatRow = ({ label, value, isAccent }: any) => (
  <Flex
    justify="space-between"
    py="12px"
    borderBottom="1px solid"
    borderColor="whiteAlpha.50"
    _last={{ border: "none" }}
  >
    <Text
      color="gray.500"
      fontSize="11px"
      fontWeight="600"
      textTransform="uppercase"
      letterSpacing="0.5px"
    >
      {label}
    </Text>
    <Text fontSize="13px" fontWeight="700" color={isAccent ? "#e8d7fd" : "white"}>
      {value}
    </Text>
  </Flex>
)

export default ProfilePage
