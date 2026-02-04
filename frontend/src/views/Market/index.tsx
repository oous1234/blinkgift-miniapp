import React, { useState } from "react"
import {
  Box, VStack, Heading, Text, Flex, useDisclosure, IconButton, Center, Spinner, HStack, Badge, Button
} from "@chakra-ui/react"
import { RepeatIcon, SettingsIcon } from "@chakra-ui/icons"
import { useSniperLogic } from "./hooks/useSniperLogic"
import { FeedCard } from "@components/Market/FeedCard"
import BottomNavigation from "@components/navigation/BottomNavigation"
import SearchDrawer from "@components/overlay/search/SearchDrawer"
import GiftDetailDrawer from "@components/overlay/GiftDetailDrawer"
import InventoryService from "@services/inventory"
import { SniperFilterDrawer } from "./components/SniperFilterDrawer"

const MarketView: React.FC = () => {
  const { events, isConnected, filters, applyFilters, clearHistory } = useSniperLogic()
  const filterDisclosure = useDisclosure()
  const detailDisclosure = useDisclosure()
  const searchDisclosure = useDisclosure()

  const [selectedGift, setSelectedGift] = useState<any>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  const activeFiltersCount = (filters.models?.length || 0) + (filters.backdrops?.length || 0)

  const handleItemClick = async (item: any) => {
    const nameParts = item.name.split("#")
    if (nameParts.length < 2) return
    const slug = nameParts[0].trim().toLowerCase().replace(/\s+/g, "-")
    const num = parseInt(nameParts[1])

    setSelectedGift(null)
    setIsDetailLoading(true)
    detailDisclosure.onOpen()
    try {
      const detail = await InventoryService.getGiftDetail(slug, num)
      setSelectedGift(detail)
    } catch (error) {
      console.error("Failed to load gift detail", error)
    } finally {
      setIsDetailLoading(false)
    }
  }

  return (
    <Box pb="120px" px="4" pt="4" bg="#0F1115" minH="100vh">
      <Flex justify="space-between" align="center" mb={6}>
        <VStack align="start" spacing={0}>
          <Heading size="lg" fontWeight="900" letterSpacing="-1px">
            Sniper <Text as="span" color="brand.500">Feed</Text>
          </Heading>
          <HStack spacing={2}>
            <Box
              boxSize="8px"
              borderRadius="full"
              bg={isConnected ? "green.400" : "red.400"}
              boxShadow={isConnected ? "0 0 8px #48BB78" : "none"}
            />
            <Text color="whiteAlpha.400" fontSize="11px" fontWeight="800">
              {isConnected ? "LIVE" : "RECONNECTING..."}
            </Text>
          </HStack>
        </VStack>

        <HStack spacing={2}>
            {/* Кнопка очистки теперь вызывает clearHistory из хука */}
            <IconButton
              aria-label="Clear" icon={<RepeatIcon />} variant="ghost" color="whiteAlpha.300"
              onClick={clearHistory}
            />
            <Box position="relative">
                <IconButton
                  aria-label="Filters" icon={<SettingsIcon />} variant="solid" bg="whiteAlpha.100"
                  borderRadius="16px" h="48px" w="48px" onClick={filterDisclosure.onOpen}
                />
                {activeFiltersCount > 0 && (
                    <Badge
                        position="absolute" top="-2px" right="-2px" colorScheme="purple"
                        borderRadius="full" variant="solid" fontSize="10px"
                    >
                        {activeFiltersCount}
                    </Badge>
                )}
            </Box>
        </HStack>
      </Flex>

      {events.length === 0 ? (
        <Center h="50vh" flexDirection="column" textAlign="center" px={10}>
          <Text color="whiteAlpha.400" fontWeight="700" mb={4}>
            {activeFiltersCount > 0
              ? "ОЖИДАЕМ НОВЫЕ ЛИСТИНГИ..."
              : "НАСТРОЙТЕ ФИЛЬТРЫ ДЛЯ НАЧАЛА МОНИТОРИНГА"}
          </Text>
          <Button
            size="sm" variant="outline" borderColor="whiteAlpha.200" color="whiteAlpha.600"
            onClick={filterDisclosure.onOpen}
          >
            {activeFiltersCount > 0 ? "Изменить фильтры" : "Настроить фильтры"}
          </Button>
        </Center>
      ) : (
        <Box>
          <Flex justify="space-between" align="center" mb={3} px={1}>
             <Text fontSize="10px" fontWeight="900" color="whiteAlpha.300" textTransform="uppercase">
               Последние находки ({events.length})
             </Text>
          </Flex>
          {events.map((item) => (
            <FeedCard
              key={item.id}
              item={item}
              dealScore={item.dealScore}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </Box>
      )}

      <SniperFilterDrawer
        isOpen={filterDisclosure.isOpen}
        onClose={filterDisclosure.onClose}
        activeFilters={filters}
        onApply={applyFilters}
      />

      <GiftDetailDrawer
        isOpen={detailDisclosure.isOpen}
        onClose={detailDisclosure.onClose}
        gift={selectedGift}
        isLoading={isDetailLoading}
        isError={false}
      />

      <SearchDrawer
        isOpen={searchDisclosure.isOpen}
        onClose={searchDisclosure.onClose}
      />
      <BottomNavigation onSearchOpen={searchDisclosure.onOpen} />
    </Box>
  )
}

export default MarketView