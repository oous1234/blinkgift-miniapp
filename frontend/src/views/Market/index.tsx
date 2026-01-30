import React, { useEffect, useState } from "react"
import {
  Box,
  VStack,
  Spinner,
  Center,
  Heading,
  Text,
  Flex,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react"
import { RepeatIcon } from "@chakra-ui/icons"
import MarketplaceService from "@services/marketplace"
import InventoryService from "@services/inventory"
import { MarketplaceItem } from "@types/marketplace"
import { GiftItem } from "@types/inventory"
import { FeedCard } from "@components/Market/FeedCard"
import BottomNavigation from "@components/navigation/BottomNavigation"
import SearchDrawer from "@components/overlay/search/SearchDrawer"
import GiftDetailDrawer from "@components/overlay/GiftDetailDrawer"

const MarketView: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  const searchDisclosure = useDisclosure()
  const detailDisclosure = useDisclosure()

  const fetchMarketData = () => {
    setIsLoading(true)
    MarketplaceService.getShowcase().then((data) => {
      setItems(data)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    fetchMarketData()
    // Эмуляция живой ленты: обновляем раз в 30 секунд
    const interval = setInterval(fetchMarketData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleItemClick = async (marketItem: MarketplaceItem) => {
    // Вытягиваем slug и номер из имени "Gift Name #123"
    const nameParts = marketItem.name.split("#")
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
      {/* Заголовок ленты */}
      <Flex justify="space-between" align="center" mb={6}>
        <VStack align="start" spacing={0}>
          <Heading size="lg" fontWeight="900" letterSpacing="-1px">
            Sniper <Text as="span" color="brand.500">Feed</Text>
          </Heading>
          <Text color="whiteAlpha.400" fontSize="11px" fontWeight="800" textTransform="uppercase">
            Live Market Intelligence
          </Text>
        </VStack>
        <IconButton
          aria-label="Refresh"
          icon={<RepeatIcon />}
          variant="ghost"
          color="brand.500"
          onClick={fetchMarketData}
          isLoading={isLoading}
        />
      </Flex>

      {/* Сама лента */}
      {isLoading && items.length === 0 ? (
        <Center h="50vh">
          <Spinner color="brand.500" size="xl" thickness="4px" />
        </Center>
      ) : (
        <Box>
          {items.map((item) => (
            <FeedCard
              key={item.id}
              item={item}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </Box>
      )}

      {/* Оверлеи */}
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