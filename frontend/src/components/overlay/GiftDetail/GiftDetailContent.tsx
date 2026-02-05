import React, { useState } from "react";
import { Box, VStack, HStack, Text, Image, Badge, Tabs, TabList, TabPanels, Tab, TabPanel, SimpleGrid } from "@chakra-ui/react";
import { Gift } from "../../../types/domain";
import { TonValue } from "../../shared/Typography";
import { BlockchainHistory } from "../BlockchainHistory";

export const GiftDetailContent: React.FC<{ gift: Gift; history: any[]; isHistoryLoading: boolean }> = ({
  gift, history, isHistoryLoading
}) => {
  return (
    <VStack spacing={6} align="stretch">
      {/* Visual Block */}
      <HStack spacing={4} align="center">
        <Box boxSize="120px" borderRadius="24px" overflow="hidden" bg="whiteAlpha.100">
          <Image src={gift.image} w="100%" h="100%" objectFit="cover" />
        </Box>
        <VStack align="start" spacing={1}>
          <Text fontSize="22px" fontWeight="900">{gift.name}</Text>
          <Badge colorScheme="purple" variant="subtle" borderRadius="6px" px={2}>
            #{gift.number}
          </Badge>
          <Text color="gray.500" fontSize="12px" fontWeight="700">Telegram Gift NFT</Text>
        </VStack>
      </HStack>

      {/* Attributes Grid */}
      <SimpleGrid columns={2} spacing={2}>
        {gift.attributes.map((attr, i) => (
          <HStack key={i} justify="space-between" bg="whiteAlpha.50" p={2.5} borderRadius="12px">
            <VStack align="start" spacing={0}>
              <Text color="gray.500" fontSize="9px" fontWeight="800" textTransform="uppercase">{attr.label}</Text>
              <Text fontSize="11px" fontWeight="800" isTruncated maxW="80px">{attr.value}</Text>
            </VStack>
            <Text color="brand.500" fontSize="10px" fontWeight="900">{attr.rarity}%</Text>
          </HStack>
        ))}
      </SimpleGrid>

      {/* Analytics & History Tabs */}
      <Tabs variant="unstyled" isFitted>
        <TabList bg="whiteAlpha.50" p="4px" borderRadius="16px">
          {["АНАЛИТИКА", "ИСТОРИЯ"].map((label) => (
            <Tab
              key={label}
              fontSize="11px"
              fontWeight="900"
              borderRadius="12px"
              color="gray.500"
              _selected={{ bg: "brand.500", color: "gray.900" }}
              py={2}
            >
              {label}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel px={0} pt={4}>
            <VStack spacing={4} align="stretch">
              <Box bg="whiteAlpha.50" p={4} borderRadius="20px">
                <HStack justify="space-between" mb={3}>
                  <Text color="gray.500" fontSize="13px" fontWeight="700">ОЦЕНКА</Text>
                  <TonValue value={gift.estimatedPrice} />
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.500" fontSize="13px" fontWeight="700">FLOOR</Text>
                  <TonValue value={gift.floorPrice} />
                </HStack>
              </Box>
            </VStack>
          </TabPanel>
          <TabPanel px={0} pt={4}>
            <BlockchainHistory history={history} isLoading={isHistoryLoading} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};