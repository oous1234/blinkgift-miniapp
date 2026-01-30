import React, { useEffect, useState } from "react"
import { Box, VStack, Heading, Text, Center, Spinner, IconButton, Flex } from "@chakra-ui/react"
import { RepeatIcon } from "@chakra-ui/icons"
import FeedService from "../../services/feed.service"
import { FeedEvent } from "../../types/feed"
import { FeedCard } from "./components/FeedCard"
import BottomNavigation from "../../components/navigation/BottomNavigation"
import SearchDrawer from "../../components/overlay/search/SearchDrawer"
import GiftDetailDrawer from "../../components/overlay/GiftDetailDrawer"
import InventoryService from "../../services/inventory"
import { GiftItem } from "../../types/inventory"

const LiveFeedView: React.FC = () => {
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const loadFeed = async () => {
    setIsLoading(true)
    const data = await FeedService.getLiveFeed()
    setEvents(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadFeed()
    const interval = setInterval(loadFeed, 30000) // Обновляем каждые 30 сек
    return () => clearInterval(interval)
  }, [])

  const handleCardClick = async (event: FeedEvent) => {
    const item = event.item as any
    const slug = item.name.toLowerCase().replace(/\s+/g, '-').split('#')[0]
    const num = parseInt(item.name.split('#')[1])

    setIsDetailOpen(true)
    setIsDetailLoading(true)
    try {
      const detail = await InventoryService.getGiftDetail(slug, num)
      setSelectedGift(detail)
    } catch (e) {
      console.error(e)
    } finally {
      setIsDetailLoading(false)
    }
  }

  return (
    <Box pb="120px" px={4} pt={4} bg="#0F1115" minH="100vh">
      <Flex justify="space-between" align="center" mb={6}>
        <VStack align="start" spacing={0}>
          <Heading size="lg" fontWeight="900" letterSpacing="-1px">
            Sniper <Text as="span" color="brand.500">Feed</Text>
          </Heading>
          <Text color="whiteAlpha.400" fontSize="12px" fontWeight="700">
            ЖИВАЯ ЛЕНТА СДЕЛОК И ЛИСТИНГОВ
          </Text>
        </VStack>
        <IconButton
          aria-label="Refresh"
          icon={<RepeatIcon />}
          variant="ghost"
          color="brand.500"
          onClick={loadFeed}
          isLoading={isLoading}
        />
      </Flex>

      {isLoading && events.length === 0 ? (
        <Center h="50vh">
          <Spinner color="brand.500" size="xl" thickness="4px" />
        </Center>
      ) : (
        <VStack align="stretch" spacing={1}>
          {events.map((event) => (
            <FeedCard
              key={event.id}
              event={event}
              onClick={() => handleCardClick(event)}
            />
          ))}
        </VStack>
      )}

      {/* Интеграция с существующими оверлеями */}
      <GiftDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        gift={selectedGift}
        isLoading={isDetailLoading}
        isError={false}
      />

      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <BottomNavigation onSearchOpen={() => setIsSearchOpen(true)} />
    </Box>
  )
}

export default LiveFeedView