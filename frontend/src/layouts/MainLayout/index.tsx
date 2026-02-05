import React from "react"
import { Box, Flex, Text, IconButton, HStack } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import { useUIStore } from "../../store/useUIStore"
import { ShareIcon, SettingsIcon } from "../../components/Shared/Icons"
import AdBanner from "../../components/Home/AdBanner"
import BottomNavigation from "../../components/navigation/BottomNavigation"
import SearchDrawer from "../../components/overlay/search/SearchDrawer"
import SettingsDrawer from "../../components/overlay/SettingsDrawer"
import SnappySubscriptionDrawer from "../../components/overlay/SnappySubscriptionDrawer"
import GiftDetailDrawer from "../../components/overlay/GiftDetailDrawer"
import { useGiftDetail } from "../../hooks/useGiftDetail"

const MainLayout: React.FC = () => {
  const ui = useUIStore()
  const { gift, history, isHistoryLoading, reset } = useGiftDetail()

  const handleShare = () => {
    window.Telegram?.WebApp?.switchInlineQuery("Посмотри мой портфель в In'Snap!")
  }

  return (
    <Box minH="100vh" bg="#0F1115" color="white">
      <AdBanner />

      <Flex as="header" align="center" justify="space-between" px={4} h="60px" position="sticky" top="0" zIndex={100} bg="#0F1115">
        <Flex
          as="button"
          onClick={ui.openSubscription}
          align="center" bg="whiteAlpha.100" px={3} h="36px" borderRadius="18px" backdropFilter="blur(10px)"
        >
          <Box w="6px" h="6px" borderRadius="full" bg="brand.500" mr={2} boxShadow="0 0 8px #e8d7fd" />
          <Text fontSize="12px" fontWeight="800">SNAPPY<Text as="span" color="brand.500">+</Text></Text>
        </Flex>

        <HStack spacing={2}>
          <IconButton
            aria-label="Share" icon={<ShareIcon boxSize="18px" />}
            onClick={handleShare} bg="whiteAlpha.100" borderRadius="full" size="sm"
          />
          <IconButton
            aria-label="Settings" icon={<SettingsIcon boxSize="18px" />}
            onClick={ui.openSettings} bg="whiteAlpha.100" borderRadius="full" size="sm"
          />
        </HStack>
      </Flex>

      <Box as="main">
        <Outlet />
      </Box>

      <SearchDrawer isOpen={ui.isSearchOpen} onClose={ui.closeSearch} />
      <SettingsDrawer isOpen={ui.isSettingsOpen} onClose={ui.closeSettings} />
      <SnappySubscriptionDrawer isOpen={ui.isSubscriptionOpen} onClose={ui.closeSubscription} />
      <GiftDetailDrawer
        isOpen={ui.isDetailOpen}
        onClose={() => { ui.closeDetail(); reset(); }}
        gift={gift}
        historyData={history}
        isHistoryLoading={isHistoryLoading}
      />

      <BottomNavigation onSearchOpen={ui.openSearch} />
    </Box>
  )
}

export default MainLayout