import React, { useEffect } from "react";
import { Box, useDisclosure, Center, Spinner } from "@chakra-ui/react";
import { useSniperStore } from "../../store/useSniperStore";
import { sniperSocketService } from "../../services/sniperSocket.service";
import { TerminalHeader } from "./components/TerminalHeader";
import { TerminalFeed } from "./components/TerminalFeed";
import { SniperFilterDrawer } from "./components/SniperFilterDrawer";
import BottomNavigation from "../../components/navigation/BottomNavigation";
import SearchDrawer from "../../components/overlay/search/SearchDrawer";

const MarketView: React.FC = () => {
  // Теперь все функции гарантированно есть в сторе
  const { events, status, isLoading, initTerminal, clearEvents } = useSniperStore();

  const filterDisclosure = useDisclosure();
  const searchDisclosure = useDisclosure();

  useEffect(() => {
    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "8241853306";

    // Запускаем инициализацию (загрузка истории + правил)
    initTerminal(userId);

    // Подключаем WebSocket
    sniperSocketService.connect(userId);

    // При размонтировании ничего не делаем, чтобы сокет жил в фоне
  }, [initTerminal]);

  return (
    <Box pb="120px" px="4" pt="4" bg="#0F1115" minH="100vh">
      <TerminalHeader
        status={status}
        eventCount={events.length}
        onClear={clearEvents}
        onOpenSettings={filterDisclosure.onOpen}
      />

      {isLoading ? (
        <Center h="50vh">
          <Spinner color="brand.500" size="xl" thickness="3px" speed="0.8s" />
        </Center>
      ) : (
        <TerminalFeed events={events} />
      )}

      <SniperFilterDrawer
        isOpen={filterDisclosure.isOpen}
        onClose={filterDisclosure.onClose}
      />

      <SearchDrawer
        isOpen={searchDisclosure.isOpen}
        onClose={searchDisclosure.onClose}
      />

      <BottomNavigation onSearchOpen={searchDisclosure.onOpen} />
    </Box>
  );
};

export default MarketView;