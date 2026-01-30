import React from "react"
import {
  Box,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Heading,
  Flex,
  Icon,
  Divider,
} from "@chakra-ui/react"
import { useHomeLogic } from "./hooks/useHomeLogic"
import { GiftCard } from "@components/Home/GiftCard"
import { Pagination } from "@components/Home/Pagination"
import { CardSurface } from "@components/Shared/UI"
import BottomNavigation from "@components/navigation/BottomNavigation"
import GiftDetailDrawer from "@components/overlay/GiftDetailDrawer"
import SearchDrawer from "@components/overlay/search/SearchDrawer"
import { TonIconBlue, GiftIconMini } from "@components/Shared/Icons"
import { InfoOutlineIcon } from "@chakra-ui/icons"

const ProfilePage: React.FC = () => {
  const logic = useHomeLogic()

  // Тестовые данные для анализатора
  const analysisStats = {
    rarityScore: 85,
    avgHoldTime: "14д",
    topCategory: "Plushies",
    estimatedAnnualProfit: "+140 TON"
  }

  return (
    <Box minH="100vh" bg="#0F1115" px={4} pt={2} pb="120px">

      {/* БЛОК 1: ОБЩАЯ СВОДКА ПОРТФЕЛЯ (В стиле Drawer Header) */}
      <CardSurface p={6} mb={4} mt={2}>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between" align="flex-start">
            <VStack align="start" spacing={0}>
              <Text color="whiteAlpha.400" fontSize="11px" fontWeight="900" textTransform="uppercase" letterSpacing="1px">
                Оценка портфеля
              </Text>
              <HStack spacing={2}>
                <Text fontSize="36px" fontWeight="900" lineHeight="1">
                  {logic.analytics.current.toFixed(2)}
                </Text>
                <TonIconBlue boxSize="24px" mt={1} />
              </HStack>
            </VStack>
            <Flex
              bg="rgba(76, 217, 100, 0.15)"
              color="#4CD964"
              px={3}
              py={1}
              borderRadius="10px"
              fontSize="13px"
              fontWeight="900"
            >
              +{logic.analytics.percent.toFixed(2)}%
            </Flex>
          </HStack>

          <SimpleGrid columns={2} spacing={4} pt={2}>
            <VStack align="start" spacing={0}>
              <Text color="whiteAlpha.400" fontSize="10px" fontWeight="800">ПРИБЫЛЬ (P/L)</Text>
              <Text fontSize="15px" fontWeight="800" color="#4CD964">+{logic.analytics.pnl.toFixed(2)} TON</Text>
            </VStack>
            <VStack align="start" spacing={0}>
              <Text color="whiteAlpha.400" fontSize="10px" fontWeight="800">ВСЕГО NFT</Text>
              <Text fontSize="15px" fontWeight="800">{logic.totalCount} шт.</Text>
            </VStack>
          </SimpleGrid>
        </VStack>
      </CardSurface>

      {/* БЛОК 2: АНАЛИТИЧЕСКИЕ ИНСАЙТЫ (Анализатор) */}
      <CardSurface p={5} mb={6} border="1px solid" borderColor="brand.500" boxShadow="0 0 20px rgba(232, 215, 253, 0.05)">
        <HStack mb={4} spacing={2}>
          <Icon as={InfoOutlineIcon} color="brand.500" boxSize="14px" />
          <Text fontSize="12px" fontWeight="900" letterSpacing="0.5px" textTransform="uppercase">
            Анализ коллекции
          </Text>
        </HStack>

        <VStack align="stretch" spacing={3}>
          <InsightRow label="Rarity Score" value={`${analysisStats.rarityScore}/100`} />
          <InsightRow label="Среднее удержание" value={analysisStats.avgHoldTime} />
          <InsightRow label="Лучшая категория" value={analysisStats.topCategory} />
          <InsightRow label="Ожидаемый доход" value={analysisStats.estimatedAnnualProfit} isGreen />
        </VStack>
      </CardSurface>

      {/* БЛОК 3: ИНВЕНТАРЬ (Сетка подарков) */}
      <Box mb={4}>
        <HStack justify="space-between" mb={4} px={1}>
          <HStack spacing={2}>
            <Icon as={GiftIconMini} color="whiteAlpha.600" />
            <Heading size="sm" fontWeight="900">ИНВЕНТАРЬ</Heading>
          </HStack>
          <Text fontSize="xs" color="whiteAlpha.400" fontWeight="800">
            {logic.items.length} из {logic.totalCount}
          </Text>
        </HStack>

        <SimpleGrid columns={2} spacing={3}>
          {logic.items.map((item) => (
            <GiftCard key={item.id} item={item} onClick={logic.handleGiftClick} />
          ))}
        </SimpleGrid>
      </Box>

      {/* Пагинация */}
      <Pagination
        currentPage={logic.currentPage}
        totalCount={logic.totalCount}
        pageSize={logic.limit}
        onPageChange={logic.setPage}
      />

      {/* Модалки и Навигация */}
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

// Вспомогательный компонент для строк анализа
const InsightRow = ({ label, value, isGreen }: { label: string, value: string, isGreen?: boolean }) => (
  <Flex justify="space-between" align="center">
    <Text color="whiteAlpha.500" fontSize="12px" fontWeight="700">{label}</Text>
    <Text fontSize="13px" fontWeight="900" color={isGreen ? "#4CD964" : "white"}>{value}</Text>
  </Flex>
)

export default ProfilePage