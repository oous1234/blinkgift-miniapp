import React from "react";
import { Box, Flex, IconButton, HStack, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

// Stores & Hooks
import { useUIStore } from "../../store/useUIStore";
import { useGiftDetail } from "../../hooks/useGiftDetail";

// Components
import { ShareIcon, SettingsIcon } from "../../components/Shared/Icons";
import BottomNavigation from "../../components/navigation/BottomNavigation";
import AdBanner from "../../components/Home/AdBanner";

// Overlays / Drawers
import SearchDrawer from "../../components/overlay/search/SearchDrawer";
import GiftDetailDrawer from "../../components/overlay/GiftDetailDrawer";
import SettingsDrawer from "../../components/overlay/SettingsDrawer";
import SnappySubscriptionDrawer from "../../components/overlay/SnappySubscriptionDrawer";
import { SniperFilterDrawer } from "../../views/Market/components/SniperFilterDrawer";

const MainLayout: React.FC = () => {
  const ui = useUIStore();

  // Получаем состояние деталей подарка (нужно для GiftDetailDrawer)
  const { gift, history, isLoading, isHistoryLoading } = useGiftDetail();

  const handleShare = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.switchInlineQuery(
        "Посмотри мой NFT портфель в In'Snap!",
        ["users", "groups", "channels"]
      );
    }
  };

  return (
    <Box minH="100vh" bg="brand.bg" color="white">
      {/* Рекламный баннер в самом верху */}
      <AdBanner />

      {/* Шапка приложения */}
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
      >
        <Flex
          as="button"
          onClick={ui.openSubscription}
          align="center"
          bg="whiteAlpha.100"
          px={3}
          h="36px"
          borderRadius="18px"
          _active={{ transform: "scale(0.95)" }}
          transition="0.2s"
        >
          <Box
            w="6px"
            h="6px"
            borderRadius="full"
            bg="brand.500"
            mr={2}
            boxShadow="0 0 8px #e8d7fd"
          />
          <Text fontSize="12px" fontWeight="800">
            SNAPPY<Text as="span" color="brand.500">+</Text>
          </Text>
        </Flex>

        <HStack spacing={2}>
          <IconButton
            aria-label="Share"
            icon={<ShareIcon boxSize="18px" />}
            onClick={handleShare}
            bg="whiteAlpha.100"
            borderRadius="full"
            size="sm"
            _active={{ bg: "whiteAlpha.200" }}
          />
          <IconButton
            aria-label="Settings"
            icon={<SettingsIcon boxSize="18px" />}
            onClick={ui.openSettings}
            bg="whiteAlpha.100"
            borderRadius="full"
            size="sm"
            _active={{ bg: "whiteAlpha.200" }}
          />
        </HStack>
      </Flex>

      {/* Основной контент (страницы Home, Market, Trade и т.д.) */}
      <Box as="main" pb="100px">
        <Outlet />
      </Box>

      {/* Глобальные оверлеи и выезжающие панели */}
      <SearchDrawer
        isOpen={ui.isSearchOpen}
        onClose={ui.closeSearch}
      />

      <GiftDetailDrawer
        gift={gift}
        history={history}
        isLoading={isLoading}
        isHistoryLoading={isHistoryLoading}
      />

      <SettingsDrawer
        isOpen={ui.isSettingsOpen}
        onClose={ui.closeSettings}
      />

      <SnappySubscriptionDrawer
        isOpen={ui.isSubscriptionOpen}
        onClose={ui.closeSubscription}
      />

      <SniperFilterDrawer
        isOpen={ui.isSniperFiltersOpen}
        onClose={ui.closeSniperFilters}
      />

      {/* Нижняя навигация */}
      <BottomNavigation onSearchOpen={ui.openSearch} />
    </Box>
  );
};

export default MainLayout;