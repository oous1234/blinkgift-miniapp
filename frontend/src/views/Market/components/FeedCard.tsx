import React from "react";
import { Box, Flex, Text, Image, HStack, Badge, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { TonIconBlue } from "../../../components/Shared/Icons";
import { SniperEvent } from "../../../types/sniper";

const MotionBox = motion(Box);

export const FeedCard: React.FC<{ item: SniperEvent; onClick: () => void }> = ({ item, onClick }) => {
  const isExcellent = (item.dealScore || 0) > 15;

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      p="12px"
      mb="8px"
      bg="#121418"
      borderRadius="16px"
      border="1px solid"
      borderColor={isExcellent ? "rgba(232, 215, 253, 0.4)" : "whiteAlpha.100"}
      position="relative"
      cursor="pointer"
    >
      <Flex align="center" gap={3}>
        <Box position="relative">
          <Image src={item.imageUrl} boxSize="52px" borderRadius="12px" bg="black" fallback={<Box boxSize="52px" borderRadius="12px" bg="whiteAlpha.50" />} />
          {isExcellent && (
            <Box position="absolute" top="-2px" right="-2px" boxSize="10px" bg="brand.500" borderRadius="full" border="2px solid #121418" />
          )}
        </Box>

        <VStack align="start" spacing={0} flex={1}>
          <HStack w="100%" justify="space-between">
            <Text fontSize="13px" fontWeight="900" color="white" isTruncated maxW="140px">
              {item.name?.replace(/#/g, ' #')}
            </Text>
            <Text fontSize="10px" color="whiteAlpha.400" fontWeight="bold">
              {new Date(item.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </HStack>

          <HStack spacing={2} mt={1}>
             <Badge variant="subtle" bg="whiteAlpha.100" color="whiteAlpha.600" fontSize="8px" px={1} borderRadius="4px">{item.model}</Badge>
             <Text fontSize="10px" color="whiteAlpha.500" fontWeight="bold">
                {item.marketplace?.toUpperCase()}
             </Text>
          </HStack>
        </VStack>

        <VStack align="end" spacing={0} minW="75px">
          <HStack spacing={1}>
            <Text fontWeight="900" fontSize="16px" color="white">{item.price}</Text>
            <TonIconBlue boxSize="12px" />
          </HStack>
          {item.dealScore ? (
             <Text fontSize="10px" fontWeight="900" color="#4CD964">+{item.dealScore}% ПРОФИТ</Text>
          ) : (
             <Text fontSize="9px" color="whiteAlpha.400" fontWeight="bold">СТАБИЛЬНО</Text>
          )}
        </VStack>
      </Flex>
    </MotionBox>
  );
};