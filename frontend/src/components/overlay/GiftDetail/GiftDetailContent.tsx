import React from "react";
import {
  Box, VStack, HStack, Text, Image, Badge, Tabs,
  TabList, TabPanels, Tab, TabPanel, SimpleGrid, Center, Spinner
} from "@chakra-ui/react";
import { Gift } from "../../../types/domain";
import { TonValue } from "../../Shared/Typography";
import { BlockchainHistory } from "../BlockchainHistory";

interface Props {
  gift: Gift;
  history: any[];
  isHistoryLoading: boolean;
}

export const GiftDetailContent: React.FC<Props> = ({
  gift,
  history,
  isHistoryLoading
}) => {
  return (
    <VStack spacing={6} align="stretch">
      {/* Header Info */}
      <HStack spacing={4} align="center">
        <Box
          boxSize="100px"
          borderRadius="24px"
          overflow="hidden"
          bg="whiteAlpha.100"
          border="1px solid"
          borderColor="whiteAlpha.100"
        >
          <Image src={gift.image} w="100%" h="100%" objectFit="cover" />
        </Box>
        <VStack align="start" spacing={1}>
          <Text fontSize="20px" fontWeight="900" lineHeight="1.2">
            {gift.name.split('#')[0]}
            <Text as="span" color="brand.500" ml={1}>#{gift.number}</Text>
          </Text>
          <Badge bg="whiteAlpha.200" color="whiteAlpha.700" borderRadius="6px" px={2} fontSize="10px">
            TELEGRAM GIFT NFT
          </Badge>
        </VStack>
      </HStack>

      {/* Attributes Grid */}
      <SimpleGrid columns={2} spacing={2}>
        {gift.attributes.map((attr, i) => (
          <HStack key={i} justify="space-between" bg="brand.surface" p={3} borderRadius="16px" border="1px solid" borderColor="whiteAlpha.50">
            <VStack align="start" spacing={0}>
              <Text color="whiteAlpha.400" fontSize="9px" fontWeight="800" textTransform="uppercase">
                {attr.label}
              </Text>
              <Text fontSize="12px" fontWeight="800" isTruncated maxW="80px">
                {attr.value}
              </Text>
            </VStack>
            <Box textAlign="right">
              <Text color="brand.500" fontSize="10px" fontWeight="900">
                {attr.rarity}%
              </Text>
              <Text fontSize="8px" color="whiteAlpha.300" fontWeight="bold">RARE</Text>
            </Box>
          </HStack>
        ))}
      </SimpleGrid>

      {/* Tabs Section */}
      <Tabs variant="unstyled">
        <TabList bg="whiteAlpha.50" p="4px" borderRadius="14px" display="flex">
          {["АНАЛИТИКА", "ИСТОРИЯ"].map((label) => (
            <Tab
              key={label}
              flex={1}
              fontSize="11px"
              fontWeight="900"
              borderRadius="10px"
              color="whiteAlpha.400"
              _selected={{ bg: "whiteAlpha.200", color: "white" }}
              py={2}
            >
              {label}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel px={0} pt={4}>
            <VStack spacing={3} align="stretch">
              <Box bg="brand.surface" p={4} borderRadius="20px" border="1px solid" borderColor="whiteAlpha.50">
                <HStack justify="space-between" mb={4}>
                  <Text color="whiteAlpha.500" fontSize="13px" fontWeight="700">РЫНОЧНАЯ ЦЕНА</Text>
                  <TonValue value={gift.estimatedPrice} size="md" />
                </HStack>
                <HStack justify="space-between">
                  <Text color="whiteAlpha.500" fontSize="13px" fontWeight="700">FLOOR PRICE</Text>
                  <TonValue value={gift.floorPrice} size="md" />
                </HStack>
              </Box>
            </VStack>
          </TabPanel>
          <TabPanel px={0} pt={4}>
            {isHistoryLoading ? (
              <Center py={10}><Spinner color="brand.500" /></Center>
            ) : (
              <BlockchainHistory history={history} />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};