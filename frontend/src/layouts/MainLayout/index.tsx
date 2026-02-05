import React from "react";
import { Box, Flex, IconButton, HStack, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { useUIStore } from "../../store/useUIStore";
import { useGiftDetail } from "../../hooks/useGiftDetail";
import { ShareIcon, SettingsIcon } from "../../components/shared/Icons";
import BottomNavigation from "../../components/navigation/BottomNavigation";
import SearchDrawer from "../../components/overlay/search/SearchDrawer";
import GiftDetailDrawer from "../../components/overlay/GiftDetailDrawer";
import SettingsDrawer from "../../components/overlay/SettingsDrawer";
import SnappySubscriptionDrawer from "../../components/overlay/SnappySubscriptionDrawer";
import { SniperFilterDrawer } from "../../views/Market/components/SniperFilterDrawer";

const MainLayout: React.FC = () => {
  const ui = useUIStore();
  const { gift, history, isLoading, isHistoryLoading, reset } = useGiftDetail();

  const handleShare = () => {
    window.Telegram?.WebApp?.switchInlineQuery("Look at my NFT portfolio!");
  };

  return (
    <Box minH="100vh" bg="brand.bg" color="white">
      {/* Global Header */}
      <Flex as="header" align="center" justify="space-between" px={4} h="60px" position="sticky" top="0" zIndex={100} bg="brand.bg">
        <Flex
          as="button" onClick={ui.openSubscription} align="center"
          bg="whiteAlpha.100" px={3} h="36px" borderRadius="18px"
        >
          <Box w="6px" h="6px" borderRadius="full" bg="brand.500" mr={2} />
          <Text fontSize="12px" fontWeight="800">SNAPPY<Text as="span" color="brand.500">+</Text></Text>
        </Flex>
        <HStack spacing={2}>
          <IconButton aria-label="Share" icon={<ShareIcon boxSize="18px" />} onClick={handleShare} bg="whiteAlpha.100" borderRadius="full" size="sm" />
          <IconButton aria-label="Settings" icon={<SettingsIcon boxSize="18px" />} onClick={ui.openSettings} bg="whiteAlpha.100" borderRadius="full" size="sm" />
        </HStack>
      </Flex>

      {/* Main Content */}
      <Box as="main">
        <Outlet />
      </Box>

      {/* Overlays Section */}
      <SearchDrawer isOpen={ui.isSearchOpen} onClose={ui.closeSearch} />

      <GiftDetailDrawer
        gift={gift}
        history={history}
        isLoading={isLoading}
        isHistoryLoading={isHistoryLoading}
      />

      <SettingsDrawer isOpen={ui.isSettingsOpen} onClose={ui.closeSettings} />
      <SnappySubscriptionDrawer isOpen={ui.isSubscriptionOpen} onClose={ui.closeSubscription} />
      <SniperFilterDrawer isOpen={ui.isSniperFiltersOpen} onClose={ui.closeSniperFilters} />

      {/* Navigation */}
      <BottomNavigation onSearchOpen={ui.openSearch} />
    </Box>
  );
};

export default MainLayout;