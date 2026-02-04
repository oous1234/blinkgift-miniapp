import React from "react";
import { Flex, VStack, HStack, Heading, Text, Badge, IconButton, Box } from "@chakra-ui/react";
import { RepeatIcon, SettingsIcon } from "@chakra-ui/icons";
import { ConnectionStatus } from "../../../types/sniper";

interface Props {
  status: ConnectionStatus;
  eventCount: number;
  onClear: () => void;
  onOpenSettings: () => void;
}

export const TerminalHeader: React.FC<Props> = ({ status, eventCount, onClear, onOpenSettings }) => {
  const statusColor = {
    CONNECTED: "green.400",
    CONNECTING: "yellow.400",
    DISCONNECTED: "red.500"
  }[status];

  const statusText = {
    CONNECTED: "LIVE",
    CONNECTING: "ПОДКЛЮЧЕНИЕ",
    DISCONNECTED: "ОФФЛАЙН"
  }[status];

  return (
    <Flex justify="space-between" align="center" mb={6} position="sticky" top="0" bg="#0F1115" zIndex={10} py={2}>
      <VStack align="start" spacing={0}>
        <HStack spacing={2}>
          <Heading size="md" fontWeight="900" letterSpacing="-1px">TERMINAL</Heading>
          <Badge bg={statusColor} color="black" fontSize="9px" px={1.5} borderRadius="4px">
            {statusText}
          </Badge>
        </HStack>
        <Text color="whiteAlpha.400" fontSize="10px" fontWeight="800">
          НАЙДЕНО: {eventCount}
        </Text>
      </VStack>

      <HStack spacing={2}>
        <IconButton
          aria-label="Clear" icon={<RepeatIcon />} variant="ghost" color="whiteAlpha.300"
          onClick={onClear} size="sm"
        />
        <IconButton
          aria-label="Settings" icon={<SettingsIcon />} bg="whiteAlpha.100" color="white"
          onClick={onOpenSettings} borderRadius="12px" size="md"
        />
      </HStack>
    </Flex>
  );
};