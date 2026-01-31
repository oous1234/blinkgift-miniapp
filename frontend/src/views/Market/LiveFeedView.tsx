import React, { useEffect, useState } from "react"
import { Box, VStack, Heading, Text, Center, Spinner, Flex, HStack } from "@chakra-ui/react"
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { FeedEvent } from "../../types/feed"
import { FeedCard } from "./components/FeedCard"
import BottomNavigation from "../../components/navigation/BottomNavigation"

const LiveFeedView: React.FC = () => {
  // Начинаем с ПУСТОГО массива, чтобы не было тестовых данных
  const [events, setEvents] = useState<FeedEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socket = new SockJS('https://blinkback.ru.tuna.am/ws-deals')
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        setIsConnected(true)
        stompClient.subscribe('/topic/deals', (message) => {
          const deal = JSON.parse(message.body)

          const newEvent: FeedEvent = {
            id: deal.id,
            type: "LISTING",
            timestamp: deal.timestamp,
            dealScore: deal.dealScore, // Реальный скор из бэка
            confidence: "HIGH",
            item: {
              id: deal.id,
              name: deal.name,
              price: deal.price,
              estimatedPrice: deal.floor, // Используем флор как оценку
              marketplace: deal.marketplace,
              imageUrl: `https://nft.fragment.com/gift/${deal.name.toLowerCase().replace(/#/g, "-").replace(/\s+/g, "")}.webp`
            } as any
          }

          setEvents(prev => [newEvent, ...prev].slice(0, 50))

          if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
          }
        })
      },
      onDisconnect: () => setIsConnected(false),
    })

    stompClient.activate()
    return () => { stompClient.deactivate() }
  }, [])

  return (
    <Box pb="120px" px={4} pt={4} bg="#0F1115" minH="100vh">
      <Flex justify="space-between" align="center" mb={6}>
        <VStack align="start" spacing={0}>
          <Heading size="lg" fontWeight="900" letterSpacing="-1px">
            Sniper <Text as="span" color="brand.500">Feed</Text>
          </Heading>
          <HStack spacing={2}>
             <Box boxSize="8px" borderRadius="full" bg={isConnected ? "green.400" : "red.400"} />
             <Text color="whiteAlpha.400" fontSize="12px" fontWeight="700">
               {isConnected ? "LIVE CONNECTION ACTIVE" : "CONNECTING..."}
             </Text>
          </HStack>
        </VStack>
      </Flex>

      <VStack align="stretch" spacing={1}>
        {events.length === 0 ? (
          <Center h="50vh" flexDirection="column" textAlign="center">
            <Spinner color="brand.500" mb={4} thickness="4px" size="xl" />
            <Text color="whiteAlpha.600" fontWeight="800" fontSize="14px">
              ЖДЕМ НОВЫЕ ЛИСТИНГИ...
            </Text>
            <Text color="whiteAlpha.300" fontSize="12px" mt={2}>
              Как только кто-то выставит подарок на маркет, <br/> он появится здесь мгновенно.
            </Text>
          </Center>
        ) : (
          events.map((event) => (
            <FeedCard
              key={event.id}
              item={event.item}
              dealScore={event.dealScore} // Передаем реальный скор
              onClick={() => {}}
            />
          ))
        )}
      </VStack>
      <BottomNavigation onSearchOpen={() => {}} />
    </Box>
  )
}
export default LiveFeedView