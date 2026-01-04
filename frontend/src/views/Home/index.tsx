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
import { motion, AnimatePresence } from "framer-motion"

import { useInventory } from "./hooks/useInventory"
import { useOwnerProfile } from "./hooks/useOwnerProfile"
import { NetWorthCard } from "@components/Home/NetWorthCard"
import { GiftCard } from "@components/Home/GiftCard"
import { Pagination } from "@components/Home/Pagination"
import { PortfolioChart } from "@components/Home/PortfolioChart"
import BottomNavigation from "@components/navigation/BottomNavigation"
import GiftDetailDrawer from "@components/overlay/GiftDetailDrawer"
import SearchOverlay from "@components/overlay/SearchOverlay"
import { GiftItem } from "../../types/inventory"

const ProfilePage: React.FC = () => {
  const [chartPeriod, setChartPeriod] = useState<string>("30d")
  const { isOpen: isStatsOpen, onToggle: onToggleStats } = useDisclosure()
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure()
  const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure()

  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)
  const { items, totalCount, currentPage, limit, setPage } = useInventory()
  const { historyData, isLoading: isChartLoading } = useOwnerProfile(chartPeriod)

  const currentChartPoints = useMemo(() => historyData?.data || [], [historyData])

  const analytics = useMemo(() => {
    const points = currentChartPoints
    if (!points || points.length < 2) return { current: 0, pnl: 0, percent: 0 }
    const first = points[0].average.ton
    const last = points[points.length - 1].average.ton
    const pnl = last - first
    return { current: last, pnl, percent: first > 0 ? (pnl / first) * 100 : 0 }
  }, [currentChartPoints])

  const handleGiftClick = (gift: GiftItem) => {
    setSelectedGift(gift)
    onDetailOpen()
  }

  return (
    <Box minH="100vh" bg="#0F1115" color="white" pb="120px" px="16px" pt="8px">
      {/* Исправлено: фиксированная высота Skeleton убирает прыжок при загрузке */}
      <Box minH="160px" mb={2}>
        <Skeleton
          isLoaded={!isChartLoading}
          borderRadius="24px"
          minH="160px"
          startColor="whiteAlpha.50"
          endColor="whiteAlpha.200"
        >
          {/* 👇 ВОТ ЗДЕСЬ ИСПОЛЬЗУЕТСЯ КАРТОЧКА, ДОБАВИЛ КУРС 1.86 */}
          <NetWorthCard
            totalValue={analytics.current}
            pnlPercent={analytics.percent}
            tonPrice={1.86}
          />
        </Skeleton>
      </Box>

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
        <Text fontSize="14px" fontWeight="600">
          Аналитика портфеля ({chartPeriod})
        </Text>
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
            {isChartLoading && (
              <Center
                position="absolute"
                inset={0}
                zIndex={2}
                bg="rgba(15,17,21,0.7)"
                borderRadius="24px"
              >
                <Spinner color="#e8d7fd" />
              </Center>
            )}
            <PortfolioChart
              historyData={currentChartPoints}
              selectedPeriod={chartPeriod}
              onPeriodChange={setChartPeriod}
            />
            <VStack align="stretch" spacing={0} mt={4}>
              <StatRow
                label="Текущая оценка"
                value={`${analytics.current.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })} TON`}
                isAccent
              />
              <StatRow label="Предметов в коллекции" value={`${totalCount} шт.`} />
            </VStack>
          </Box>
        </Box>
      </Collapse>

      <Flex align="center" justify="space-between" mb={4}>
        <Text fontSize="18px" fontWeight="700">
          Мои подарки
        </Text>
        <Badge bg="#e8d7fd" color="#0F1115" px="12px" py="3px" borderRadius="100px">
          {totalCount} шт.
        </Badge>
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

      <AnimatePresence>
        {isSearchOpen && <SearchOverlay isOpen={isSearchOpen} onClose={onSearchClose} />}
      </AnimatePresence>

      <BottomNavigation onSearchOpen={onSearchOpen} />
    </Box>
  )
}

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
