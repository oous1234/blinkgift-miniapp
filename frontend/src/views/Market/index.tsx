import React, { useEffect } from "react";
import { Box, Center, Spinner, Flex, VStack, HStack, Heading, Text, IconButton } from "@chakra-ui/react";
import { RepeatIcon, SettingsIcon } from "@chakra-ui/icons";
import { useSniperStore } from "../../store/useSniperStore";
import { useUIStore } from "../../store/useUIStore";
import { sniperSocketService } from "../../services/sniperSocket.service";
import { SniperEventCard } from "./components/SniperEventCard";
import { SniperFilterDrawer } from "./components/SniperFilterDrawer";

const MarketView: React.FC = () => {
  const { events, status, isLoading, initHistory, clearEvents, addEvent, setStatus } = useSniperStore();
  const { isSniperFiltersOpen, openSniperFilters, closeSniperFilters } = useUIStore();

  useEffect(() => {
    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "8241853306";

    initHistory(userId);

    sniperSocketService.setCallbacks(
      (event) => addEvent(event),
      (newStatus) => setStatus(newStatus)
    );

    sniperSocketService.connect(userId);

    return () => {
      sniperSocketService.disconnect();
    };
  }, [initHistory, addEvent, setStatus]);

  return (
    <Box px={4} pt={2} pb="100px">
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        position="sticky"
        top="60px"
        bg="brand.bg"
        zIndex={10}
        py={2}
      >
        <VStack align="start" spacing={0}>
          <HStack spacing={2}>
            <Heading size="md" fontWeight="900" letterSpacing="-1px">TERMINAL</Heading>
            <Box
                px={1.5}
                py={0.5}
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
            {events.length > 0 ? `ПОСЛЕДНИЕ СОБЫТИЯ: ${events.length}` : 'ОЖИДАНИЕ ДАННЫХ...'}
          </Text>
        </VStack>

        <HStack spacing={2}>
          <IconButton
            aria-label="Clear"
            icon={<RepeatIcon />}
            variant="ghost"
            color="whiteAlpha.300"
            onClick={clearEvents}
            size="sm"
          />
          <IconButton
            aria-label="Settings"
            icon={<SettingsIcon />}
            variant="brand"
            onClick={openSniperFilters}
            borderRadius="12px"
            size="md"
          />
        </HStack>
      </Flex>

      {isLoading ? (
        <Center h="50vh">
          <Spinner color="brand.500" thickness="3px" size="xl" />
        </Center>
      ) : events.length > 0 ? (
        <VStack align="stretch" spacing={1}>
            {events.map((event) => (
                <SniperEventCard
                    key={event.id}
                    event={event}
                    onClick={() => {
                    }}
                />
            ))}
        </VStack>
      ) : (
        <Center h="40vh" flexDirection="column">
            <Text color="whiteAlpha.200" fontWeight="900" fontSize="12px" mb={2}>
                СОБЫТИЙ ПОКА НЕТ
            </Text>
            <Text color="whiteAlpha.100" fontSize="10px" textAlign="center" px={10}>
                Как только на маркетплейсах появятся подходящие лоты, они отобразятся здесь.
            </Text>
        </Center>
      )}

      <SniperFilterDrawer
        isOpen={isSniperFiltersOpen}
        onClose={closeSniperFilters}
      />
    </Box>
  );
};

export default MarketView;