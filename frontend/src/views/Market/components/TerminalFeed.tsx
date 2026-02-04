// src/views/Market/components/TerminalFeed.tsx
import React from "react";
import { VStack, Center, Spinner, Text } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { SniperEvent } from "../../../types/sniper";
import { FeedCard } from "./FeedCard";

interface Props {
  events: SniperEvent[];
}

export const TerminalFeed: React.FC<Props> = ({ events }) => {
  if (events.length === 0) {
    return (
      <Center h="60vh" flexDirection="column" textAlign="center">
        <Spinner size="md" color="brand.500" thickness="3px" speed="0.8s" />
        <Text color="whiteAlpha.300" fontSize="11px" fontWeight="800" letterSpacing="1px" mt={4}>
          SCANNING MARKETPLACE...
        </Text>
      </Center>
    );
  }

  return (
    <VStack align="stretch" spacing={0}>
      <AnimatePresence initial={false}>
        {events.map((event) => (
          <FeedCard
            key={event.id}
            item={event}
            onClick={() => {/* логика открытия деталей */}}
          />
        ))}
      </AnimatePresence>
    </VStack>
  );
};