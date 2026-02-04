import React, { useState } from "react"
import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  useDisclosure,
  IconButton,
  HStack,
  Badge,
  Button,
  Spinner // Теперь импортирован
} from "@chakra-ui/react"
import { AnimatePresence } from "framer-motion"
import { RepeatIcon, SettingsIcon } from "@chakra-ui/icons"
import { useSniperLogic } from "./hooks/useSniperLogic"
import { FeedCard } from "./components/FeedCard"
import BottomNavigation from "@components/navigation/BottomNavigation"
import SearchDrawer from "@components/overlay/search/SearchDrawer"
import GiftDetailDrawer from "@components/overlay/GiftDetailDrawer"
import InventoryService from "@services/inventory"
import { SniperFilterDrawer } from "./components/SniperFilterDrawer"

const MarketView: React.FC = () => {
  const { events, isConnected, rules, saveRules, clearHistory } = useSniperLogic()
  const filterDisclosure = useDisclosure()
  const detailDisclosure = useDisclosure()
  const searchDisclosure = useDisclosure()
  const [selectedGift, setSelectedGift] = useState<any>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  const handleItemClick = async (item: any) => {
    const nameParts = item.name.split('#')
    if (nameParts.length < 2) return
    const slug = nameParts[0].trim().toLowerCase().replace(/\s+/g, "-")
    const num = parseInt(nameParts[1])

    setSelectedGift(null)
    setIsDetailLoading(true)
    detailDisclosure.onOpen()

    try {
      const detail = await InventoryService.getGiftDetail(slug, num)
      setSelectedGift(detail)
    } catch (e) {
      console.error("Detail load error", e)
    } finally {
      setIsDetailLoading(false)
    }
  }

  return (
    <Box pb="120px" px="4" pt="4" bg="#0F1115" minH="100vh">
      {/* PROFESSIONAL TERMINAL HEADER */}
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        position="sticky"
        top="0"
        bg="#0F1115"
        zIndex={5}
        py={2}
      >
        <VStack align="start" spacing={0}>
          <HStack spacing={2}>
            <Heading size="md" fontWeight="900" letterSpacing="-1px" color="white">TERMINAL</Heading>
            <Badge
              bg={isConnected ? "green.400" : "red.500"}
              color="black"
              borderRadius="4px"
              fontSize="9px"
              px={1.5}
            >
              {isConnected ? "LIVE" : "DISCONNECTED"}
            </Badge>
          </HStack>
          <Text color="whiteAlpha.400" fontSize="10px" fontWeight="800">
            {events.length} EVENTS IN FEED
          </Text>
        </VStack>

        <HStack spacing={2}>
          <IconButton
            aria-label="Clear"
            icon={<RepeatIcon />}
            variant="ghost"
            color="whiteAlpha.200"
            onClick={clearHistory}
            _active={{ bg: "transparent" }}
          />
          <Button
            leftIcon={<SettingsIcon boxSize="12px" />}
            bg={rules.length > 0 ? "brand.500" : "whiteAlpha.100"}
            color={rules.length > 0 ? "black" : "white"}
            borderRadius="12px"
            h="40px"
            px={4}
            fontSize="11px"
            fontWeight="900"
            onClick={filterDisclosure.onOpen}
            _active={{ transform: "scale(0.95)" }}
          >
            SLOTS {rules.length > 0 && `[${rules.length}]`}
          </Button>
        </HStack>
      </Flex>

      {/* FEED CONTENT */}
      {events.length === 0 ? (
        <VStack h="60vh" justify="center" spacing={4}>
          <Spinner size="md" color="brand.500" thickness="3px" speed="0.8s" />
          <Text color="whiteAlpha.300" fontSize="11px" fontWeight="800" letterSpacing="1px">
            SCANNING MARKETPLACE...
          </Text>
        </VStack>
      ) : (
        <VStack align="stretch" spacing={0}>
          <AnimatePresence initial={false}>
            {events.map((item) => (
              <FeedCard
                key={item.id || item.receivedAt}
                item={item}
                onClick={() => handleItemClick(item)}
              />
            ))}
          </AnimatePresence>
        </VStack>
      )}

      {/* OVERLAYS */}
      <SniperFilterDrawer
        isOpen={filterDisclosure.isOpen}
        onClose={filterDisclosure.onClose}
        rules={rules}
        onSave={saveRules}
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