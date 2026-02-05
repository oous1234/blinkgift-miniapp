import React, { useEffect } from "react";
import {
  Box,
  Center,
  Spinner,
  Flex,
  VStack,
  HStack,
  Heading,
  Text
} from "@chakra-ui/react";
import { useSniperStore } from "../../store/useSniperStore";
import { useUIStore } from "../../store/useUIStore";
import { sniperSocketService } from "../../services/sniperSocket.service";
import { TerminalHeader } from "./components/TerminalHeader";
import { TerminalFeed } from "./components/TerminalFeed";
import { SniperFilterDrawer } from "./components/SniperFilterDrawer";
import { RepeatIcon, SettingsIcon } from "@chakra-ui/icons";
import { SniperEventCard } from "./components/SniperEventCard";

const MarketView: React.FC = () => {
  const { events, status, isLoading, initHistory, clearEvents } = useSniperStore();
  const { isSniperFiltersOpen, openSniperFilters, closeSniperFilters } = useUIStore();

  useEffect(() => {
    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "8241853306";
    initHistory(userId);
    sniperSocketService.connect(userId);
    return () => sniperSocketService.disconnect();
  }, [initHistory]);

  return (
    <Box px={4} pt={2} pb="100px">
      <Flex justify="space-between" align="center" mb={6} position="sticky" top="0" bg="brand.bg" zIndex={10} py={2}>
        <VStack align="start" spacing={0}>
          <HStack spacing={2}>
            <Heading size="md" fontWeight="900" letterSpacing="-1px">TERMINAL</Heading>
            <Box
                px={1.5}
                borderRadius="4px"
                bg={status === "CONNECTED" ? "green.400" : "red.500"}
                color="black"
                fontSize="9px"
                fontWeight="900"
            >
              {status === "CONNECTED" ? "LIVE" : "OFFLINE"}
            </Box>
          </HStack>
          <Text color="whiteAlpha.400" fontSize="10px" fontWeight="800">
            НАЙДЕНО: {events.length}
          </Text>
        </VStack>
        <HStack spacing={2}>
          <IconButton
            aria-label="Clear" icon={<RepeatIcon />} variant="ghost" color="whiteAlpha.300"
            onClick={clearEvents} size="sm"
          />
          <IconButton
            aria-label="Settings" icon={<SettingsIcon />} bg="whiteAlpha.100" color="white"
            onClick={openSniperFilters} borderRadius="12px" size="md"
          />
        </HStack>
      </Flex>

      {isLoading ? (
        <Center h="50vh">
          <Spinner color="brand.500" thickness="3px" />
        </Center>
      ) : (
        <VStack align="stretch" spacing={0}>
            {events.map((event) => (
                <SniperEventCard
                    key={event.id}
                    event={event}
                    onClick={() => {}}
                />
            ))}
        </VStack>
      )}

      <SniperFilterDrawer
        isOpen={isSniperFiltersOpen}
        onClose={closeSniperFilters}
      />
    </Box>
  );
};

import { IconButton } from "@chakra-ui/react";

export default MarketView;