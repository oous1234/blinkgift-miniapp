import React, { useEffect } from "react";
import { Box, Flex, IconButton, HStack, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { useUIStore } from "../../store/useUIStore";
import { useGiftDetail } from "../../hooks/useGiftDetail";
import { useTelegramTheme } from "../../hooks/useTelegramTheme";
import { ShareIcon, SettingsIcon } from "../../components/Shared/Icons";
import BottomNavigation from "../../components/navigation/BottomNavigation";
import AdBanner from "../../components/Home/AdBanner";
import SearchDrawer from "../../components/overlay/search/SearchDrawer";
import GiftDetailDrawer from "../../components/overlay/GiftDetailDrawer";
import SettingsDrawer from "../../components/overlay/SettingsDrawer";
import SnappySubscriptionDrawer from "../../components/overlay/SnappySubscriptionDrawer";
import { SniperFilterDrawer } from "../../views/Market/components/SniperFilterDrawer";

const MainLayout: React.FC = () => {
  const ui = useUIStore();
  const { gift, history, isLoading, isHistoryLoading } = useGiftDetail();

  useTelegramTheme();

  const handleShare = () => {
    window.Telegram?.WebApp?.switchInlineQuery(
      "Посмотри мой NFT портфель в In'Snap!",
      ["users", "groups", "channels"]
    );
  };

  return (
    <Box minH="100vh" bg="brand.bg" color="white" position="relative">
      <AdBanner />

      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={4}
        h="60px"
        position="sticky"
        top="0"
        zIndex={100}
        bg="brand.bg"
        borderBottom="1px solid"
        borderColor="whiteAlpha.50"
        backdropFilter="blur(10px)"
      >
        <Flex
          as="button"
          onClick={ui.openSubscription}
          align="center"
          bg="whiteAlpha.100"
          px={3}
          h="36px"
          borderRadius="18px"
        >
          <Box w="6px" h="6px" borderRadius="full" bg="brand.500" mr={2} boxShadow="0 0 8px #e8d7fd" />
          <Text fontSize="12px" fontWeight="900">
            SNAPPY<Text as="span" color="brand.500">+</Text>
          </Text>
        </Flex>

        <HStack spacing={2}>
          <IconButton
            aria-label="Share"
            icon={<ShareIcon boxSize="18px" />}
            onClick={handleShare}
            variant="solid"
            size="sm"
            borderRadius="full"
          />
          <IconButton
            aria-label="Settings"
            icon={<SettingsIcon boxSize="18px" />}
            onClick={ui.openSettings}
            variant="solid"
            size="sm"
            borderRadius="full"
          />
        </HStack>
      </Flex>

      <Box as="main" pb="100px">
        <Outlet />
      </Box>

      {/* Оверлеи */}
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

      <BottomNavigation onSearchOpen={ui.openSearch} />
    </Box>
  );
};

export default MainLayout;