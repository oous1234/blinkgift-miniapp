import React from "react"
import {
  Box,
  SimpleGrid,
  Skeleton,
  Text,
  Collapse,
  VStack,
  IconButton,
  HStack,
  Avatar,
} from "@chakra-ui/react"
import { ChevronDownIcon, ChevronUpIcon, ArrowBackIcon } from "@chakra-ui/icons"
import { useNavigate, useLocation } from "react-router-dom"

import { useHomeLogic } from "./hooks/useHomeLogic"
import { NetWorthCard } from "@components/Home/NetWorthCard"
import { GiftCard } from "@components/Home/GiftCard"
import { Pagination } from "@components/Home/Pagination"
import { PortfolioChart } from "@components/Home/PortfolioChart"
import { CardSurface, StatRow } from "@components/Shared/UI"

import BottomNavigation from "@components/navigation/BottomNavigation"
import GiftDetailDrawer from "@components/overlay/GiftDetailDrawer"
import SearchDrawer from "@components/overlay/search/SearchDrawer"

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const logic = useHomeLogic()

  const profile = location.state as { name?: string; username?: string; avatarUrl?: string }

  return (
    <Box minH="100vh" bg="brand.bg" px={4} pt={4} pb="120px">
      {/* Шапка для режима просмотра чужого профиля */}
      {logic.isVisitorMode && (
        <HStack justify="space-between" mb={6} bg="whiteAlpha.50" p={3} borderRadius="20px">
          <HStack spacing={3}>
            <Avatar
              src={profile?.avatarUrl}
              name={profile?.name}
              size="sm"
              borderRadius="12px"
              border="1px solid"
              borderColor="brand.500"
            />
            <VStack align="start" spacing={0}>
              <Text fontWeight="800" fontSize="14px">{profile?.name || "User"}</Text>
              <Text fontSize="11px" color="whiteAlpha.400">@{profile?.username}</Text>
            </VStack>
          </HStack>
          <IconButton
            aria-label="Back"
            icon={<ArrowBackIcon />}
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
          />
        </HStack>
      )}

      {/* Основная карточка стоимости */}
      <Skeleton isLoaded={!logic.isChartLoading} borderRadius="24px">
        <NetWorthCard
          totalValue={logic.analytics.current}
          pnlPercent={logic.analytics.percent}
        />
      </Skeleton>

      {/* Кнопка открытия аналитики */}
      <CardSurface
        as="button"
        w="100%"
        onClick={logic.statsDisclosure.onToggle}
        mt={4}
        p={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        _active={{ transform: "scale(0.98)", bg: "whiteAlpha.100" }}
      >
        <Text fontSize="12px" fontWeight="900" letterSpacing="0.5px" textTransform="uppercase">
          Аналитика портфеля
        </Text>
        {logic.statsDisclosure.isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </CardSurface>

      {/* Раздел с графиком */}
      <Collapse in={logic.statsDisclosure.isOpen}>
        <CardSurface mt={2} p={5}>
          <PortfolioChart
            historyData={logic.historyData}
            selectedPeriod={logic.chartPeriod}
            onPeriodChange={logic.setChartPeriod}
          />
          <VStack align="stretch" mt={6}>
            <StatRow
              label="Текущая оценка"
              value={`${logic.analytics.current.toFixed(2)} TON`}
              isAccent
            />
            <StatRow
              label="Количество подарков"
              value={`${logic.totalCount} шт.`}
            />
          </VStack>
        </CardSurface>
      </Collapse>

      {/* Сетка подарков */}
      <Box mt={6}>
        <Skeleton isLoaded={!logic.isInvLoading} minH="200px">
          <SimpleGrid columns={2} spacing={3}>
            {logic.items.map((item) => (
              <GiftCard key={item.id} item={item} onClick={logic.handleGiftClick} />
            ))}
          </SimpleGrid>
        </Skeleton>
      </Box>

      {/* Пагинация */}
      <Pagination
        currentPage={logic.currentPage}
        totalCount={logic.totalCount}
        pageSize={logic.limit}
        onPageChange={logic.setPage}
      />

      {/* Оверлеи */}
      <GiftDetailDrawer
        isOpen={logic.detailDisclosure.isOpen}
        onClose={logic.detailDisclosure.onClose}
        gift={logic.selectedGift}
        isLoading={logic.isDetailLoading}
        isError={logic.isDetailError}
      />

      <SearchDrawer
        isOpen={logic.searchDisclosure.isOpen}
        onClose={logic.searchDisclosure.onClose}
      />

      <BottomNavigation onSearchOpen={logic.searchDisclosure.onOpen} />
    </Box>
  )
}

export default ProfilePage