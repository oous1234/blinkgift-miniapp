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
  Icon,
  Badge,
  VStack,
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
  const [chartPeriod, setChartPeriod] = useState<keyof PortfolioHistory>("24h")
  const { isOpen: isStatsOpen, onToggle: onToggleStats } = useDisclosure()

  const { items, totalCount, currentPage, limit, isError, setPage } = useInventory()
  const { ownerData, isLoading } = useOwnerProfile()

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

  if (isLoading) {
    return (
      <Center minH="100vh" bg="#0F1115">
        <Spinner size="lg" color="#e8d7fd" thickness="3px" />
      </Center>
    )
  }

  return (
    <Box minH="100vh" bg="#0F1115" color="white" pb="120px" px="16px" pt="8px">
      <NetWorthCard totalValue={portalsValue} pnlPercent={pnlData.percent} />

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
        _active={{ bg: "rgba(255, 255, 255, 0.08)" }}
      >
        <Text fontSize="14px" fontWeight="600" color="white">
          Аналитика
        </Text>
        <Icon as={isStatsOpen ? ChevronUpIcon : ChevronDownIcon} color="gray.500" w={5} h={5} />
      </Box>

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

      <Flex align="center" justify="space-between" mb={4} px={1}>
        <Text fontSize="18px" fontWeight="700">
          Мои подарки
        </Text>

        {/* Овальный бейдж с темным текстом лавандового цвета */}
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

      {items.length === 0 ? (
        <Center py={10} opacity={0.5}>
          <Text fontSize="14px">Пусто</Text>
        </Center>
      ) : (
        <Box>
          <SimpleGrid columns={2} spacing="12px" mb={8}>
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

const StatisticsView = ({
  totalValue,
  itemCount,
  history,
  selectedPeriod,
  onPeriodChange,
}: any) => (
  <Box
    bg="rgba(255, 255, 255, 0.02)"
    borderRadius="20px"
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
      <StatRow label="Оценочная стоимость" value={`${totalValue.toLocaleString()} TON`} isAccent />
      <StatRow label="Всего предметов" value={`${itemCount} шт.`} />
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
