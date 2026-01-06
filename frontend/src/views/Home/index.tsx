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
  HStack,
  Avatar,
  IconButton,
} from "@chakra-ui/react"
import { ChevronDownIcon, ChevronUpIcon, ArrowBackIcon } from "@chakra-ui/icons"
import { useParams, useNavigate, useLocation } from "react-router-dom" // Импорт

import { useInventory } from "./hooks/useInventory"
import { useOwnerProfile } from "./hooks/useOwnerProfile"
import { NetWorthCard } from "@components/Home/NetWorthCard"
import { GiftCard } from "@components/Home/GiftCard"
import { Pagination } from "@components/Home/Pagination"
import { PortfolioChart } from "@components/Home/PortfolioChart"
import BottomNavigation from "@components/navigation/BottomNavigation"
import GiftDetailDrawer from "@components/overlay/GiftDetailDrawer"
import SearchDrawer from "@components/overlay/SearchDrawer"
import { GiftItem } from "../../types/inventory"

const ProfilePage: React.FC = () => {
  // 1. Получаем ID из URL (если есть)
  const { id: routeUserId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  // Достаем переданные через state данные (имя, аватарка), чтобы показать сразу
  const locationState = location.state as
    | { name?: string; username?: string; avatarUrl?: string }
    | undefined

  // Если routeUserId есть - это чужой профиль. Если нет - свой.
  const isVisitorMode = !!routeUserId
  const ownerId = routeUserId // Если undefined, хуки сами возьмут "себя"

  const [chartPeriod, setChartPeriod] = useState<string>("30d")
  const { isOpen: isStatsOpen, onToggle: onToggleStats } = useDisclosure()
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure()
  const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure()

  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)

  // 2. Передаем ownerId в хуки
  const { items, totalCount, currentPage, limit, setPage } = useInventory(ownerId)
  const { historyData, isLoading: isChartLoading } = useOwnerProfile(chartPeriod, ownerId)

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

  // Обработчик кнопки Назад
  const handleBack = () => {
    // Возвращаемся назад по истории. Если пришли из поиска - откроется он.
    // Можно сделать navigate('/') и onSearchOpen(), но navigate(-1) естественнее.
    navigate(-1)
  }

  return (
    <Box minH="100vh" bg="#0F1115" color="white" pb="120px" px="16px" pt="8px">
      {/* --- ШАПКА ЧУЖОГО ПРОФИЛЯ --- */}
      {isVisitorMode && (
        <Box mb={6} pt={2}>
          <Flex justify="space-between" align="center" mb={4}>
            {/* Левая часть: Аватар и Имя */}
            <HStack spacing={3}>
              <Avatar
                src={
                  locationState?.avatarUrl ||
                  (locationState?.username
                    ? `https://poso.see.tg/api/avatar/${locationState.username}`
                    : undefined)
                }
                name={locationState?.name || "User"}
                size="md"
                border="2px solid #e8d7fd"
                boxShadow="0 0 10px rgba(232, 215, 253, 0.4)"
              />
              <VStack align="start" spacing={0}>
                <Text fontSize="16px" fontWeight="800" color="white">
                  {locationState?.name || "Viewing Profile"}
                </Text>
                <Text fontSize="12px" color="gray.400">
                  {locationState?.username ? `@${locationState.username}` : "Explorer Mode"}
                </Text>
              </VStack>
            </HStack>

            {/* Правая часть: Кнопка Назад */}
            <IconButton
              aria-label="Back"
              icon={<ArrowBackIcon />}
              onClick={handleBack}
              variant="ghost"
              color="#e8d7fd"
              fontSize="20px"
              _hover={{ bg: "whiteAlpha.100" }}
            />
          </Flex>
        </Box>
      )}

      {/* --- ОСНОВНОЙ КОНТЕНТ --- */}

      <Box minH="160px" mb={2}>
        <Skeleton
          isLoaded={!isChartLoading}
          borderRadius="24px"
          minH="160px"
          startColor="whiteAlpha.50"
          endColor="whiteAlpha.200"
        >
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
          {isVisitorMode ? "Подарки пользователя" : "Мои подарки"}
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

      <SearchDrawer isOpen={isSearchOpen} onClose={onSearchClose} />

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
