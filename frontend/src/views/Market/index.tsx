import React, { useEffect, useState } from "react"
import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  useDisclosure,
  IconButton,
  Center,
  Spinner,
  HStack,
} from "@chakra-ui/react"
import { RepeatIcon } from "@chakra-ui/icons"
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import InventoryService from "@services/inventory"
import { GiftItem } from "@types/inventory"
import { FeedCard } from "@components/Market/FeedCard"
import BottomNavigation from "@components/navigation/BottomNavigation"
import SearchDrawer from "@components/overlay/search/SearchDrawer"
import GiftDetailDrawer from "@components/overlay/GiftDetailDrawer"

const MarketView: React.FC = () => {
  const [events, setEvents] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  const searchDisclosure = useDisclosure()
  const detailDisclosure = useDisclosure()

  useEffect(() => {
    // ВАЖНО: Если бекенд локальный, используем localhost.
    // Если через туннель — укажите адрес туннеля.
    const socket = new SockJS('https://blinkback.ru.tuna.am/ws-deals')
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('STOMP:', str),
      onConnect: () => {
        setIsConnected(true)
        console.log('Connected to WebSocket')
        stompClient.subscribe('/topic/deals', (message) => {
          const deal = JSON.parse(message.body)
          console.log('Received deal:', deal)

          const newEvent = {
            ...deal,
            // Генерируем URL картинки на лету
            imageUrl: `https://nft.fragment.com/gift/${deal.name.toLowerCase().replace(/#/g, "-").replace(/\s+/g, "")}.webp`
          }

          setEvents(prev => [newEvent, ...prev].slice(0, 50))

          if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
          }
        })
      },
      onDisconnect: () => {
        setIsConnected(false)
        console.log('Disconnected')
      }
    })

    stompClient.activate()
    return () => { stompClient.deactivate() }
  }, [])

  const handleItemClick = async (item: any) => {
    // Извлекаем слаг и номер из имени типа "Golden Doge #777"
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
              {isConnected ? "LIVE CONNECTION" : "CONNECTING..."}
            </Text>
          </HStack>
        </VStack>
        <IconButton
          aria-label="Clear"
          icon={<RepeatIcon />}
          variant="ghost"
          color="whiteAlpha.300"
          onClick={() => setEvents([])}
        />
      </Flex>

      {events.length === 0 ? (
        <Center h="50vh" flexDirection="column">
          <Spinner color="brand.500" size="xl" mb={4} thickness="3px" />
          <Text color="whiteAlpha.400" fontWeight="700">ОЖИДАНИЕ НОВЫХ СДЕЛОК...</Text>
        </Center>
      ) : (
        <Box>
          {events.map((item, idx) => (
            <FeedCard
              key={item.id || idx}
              item={item}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </Box>
      )}

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