// src/views/Home/index.tsx (упрощенная версия)
import React from "react"
import { Box, SimpleGrid, Flex, Skeleton, Text, Badge, Collapse, VStack, IconButton, HStack, Avatar } from "@chakra-ui/react"
import { ChevronDownIcon, ChevronUpIcon, ArrowBackIcon } from "@chakra-ui/icons"
import { useNavigate, useLocation } from "react-router-dom"

import { useHomeLogic } from "./hooks/useHomeLogic"
import { NetWorthCard } from "@components/Home/NetWorthCard"
import { GiftCard } from "@components/Home/GiftCard"
import { Pagination } from "@components/Home/Pagination"
import { PortfolioChart } from "@components/Home/PortfolioChart"
import { StatRow } from "@components/StatRow" // Новый компонент
import BottomNavigation from "@components/navigation/BottomNavigation"
import GiftDetailDrawer from "@components/overlay/GiftDetailDrawer"
import SearchDrawer from "@components/overlay/SearchDrawer"

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const logic = useHomeLogic()

  const locationState = location.state as { name?: string; username?: string; avatarUrl?: string }

  return (
    <Box minH="100vh" bg="#0F1115" color="white" pb="120px" px="4" pt="2">

      {logic.isVisitorMode && (
        <HStack justify="space-between" mb={6}>
          <HStack spacing={3}>
            <Avatar
              src={locationState?.avatarUrl}
              name={locationState?.name}
              size="md"
              border="2px solid"
              borderColor="brand.500"
            />
            <VStack align="start" spacing={0}>
              <Text fontWeight="800">{locationState?.name || "User"}</Text>
              <Text fontSize="xs" color="gray.400">@{locationState?.username}</Text>
            </VStack>
          </HStack>
          <IconButton
            aria-label="Back"
            icon={<ArrowBackIcon />}
            variant="ghost"
            onClick={() => navigate(-1)}
          />
        </HStack>
      )}

      <Skeleton isLoaded={!logic.isChartLoading} borderRadius="24px" mb={2}>
        <NetWorthCard
          totalValue={logic.analytics.current}
          pnlPercent={logic.analytics.percent}
          tonPrice={logic.analytics.tonPrice}
        />
      </Skeleton>

      <Box
        as="button"
        w="100%"
        onClick={logic.statsDisclosure.onToggle}
        bg="whiteAlpha.50"
        p={4}
        borderRadius="16px"
        mb={6}
        display="flex"
        justifyContent="space-between"
      >
        <Text fontSize="sm" fontWeight="600">Аналитика портфеля ({logic.chartPeriod})</Text>
        {logic.statsDisclosure.isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </Box>

      <Collapse in={logic.statsDisclosure.isOpen}>
        <Box mb={8} bg="whiteAlpha.50" p={5} borderRadius="24px">
          <PortfolioChart
            historyData={logic.historyData?.data || []}
            selectedPeriod={logic.chartPeriod}
            onPeriodChange={logic.setChartPeriod}
          />
          <VStack align="stretch" mt={4}>
            <StatRow label="Текущая оценка" value={`${logic.analytics.current.toFixed(2)} TON`} isAccent />
            <StatRow label="Количество подарков" value={`${logic.totalCount} шт.`} />
          </VStack>
        </Box>
      </Collapse>

      {/* Grid с подарками */}
      <SimpleGrid columns={2} spacing={3} mb={8}>
        {logic.items.map((item) => (
          <GiftCard key={item.id} item={item} onClick={logic.handleGiftClick} />
        ))}
      </SimpleGrid>

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