import React from "react";
import { Flex, VStack, HStack, Text, Image, Box } from "@chakra-ui/react";
import { SniperEvent } from "../../../types/sniper";
import { Surface } from "../../../components/shared/Surface";
import { TonValue } from "../../../components/shared/Typography";

export const SniperEventCard: React.FC<{ event: SniperEvent; onClick: () => void }> = ({
  event,
  onClick
}) => {
  const isGoodDeal = (event.dealScore || 0) > 15;

  return (
    <Surface
      interactive
      onClick={onClick}
      mb={3}
      border={isGoodDeal ? "1px solid" : "1px solid transparent"}
      borderColor={isGoodDeal ? "brand.500" : "transparent"}
    >
      <Flex align="center" gap={4}>
        <Box position="relative">
          <Image
            src={event.imageUrl}
            boxSize="60px"
            borderRadius="16px"
            fallback={<Box boxSize="60px" bg="whiteAlpha.100" borderRadius="16px" />}
          />
          {isGoodDeal && (
            <Box
              position="absolute" top="-2px" right="-2px" boxSize="12px"
              bg="brand.500" borderRadius="full" border="2px solid #0F1115"
            />
          )}
        </Box>

        <VStack align="start" spacing={0} flex={1}>
          <HStack w="100%" justify="space-between">
            <Text fontWeight="900" fontSize="15px" isTruncated maxW="150px">
              {event.name}
            </Text>
            <Text fontSize="10px" color="whiteAlpha.400" fontWeight="bold">
              {new Date(event.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </HStack>

          <HStack spacing={2} mt={1}>
             <Text fontSize="11px" color="whiteAlpha.500" fontWeight="bold">
                {event.marketplace.toUpperCase()} • {event.model}
             </Text>
          </HStack>
        </VStack>

        <VStack align="end" spacing={0}>
          <TonValue value={event.price} size="md" />
          {event.dealScore && (
             <Text fontSize="10px" fontWeight="900" color="green.400">
               +{event.dealScore}% PROFIT
             </Text>
          )}
        </VStack>
      </Flex>
    </Surface>
  );
};