import React from "react"
import { VStack, Box, Text, SimpleGrid, Tabs, TabList, TabPanels, Tab, TabPanel, Center } from "@chakra-ui/react"
import { Gift } from "../../types/domain"
import { AttributeItem } from "./AttributeItem"
import { MarketStatRow } from "./MarketStatRow"
import { BlockchainHistory } from "../overlay/BlockchainHistory"
import { TonValue } from "../Shared/TonValue"

interface Props {
  gift: Gift
  historyData: any[]
  isHistoryLoading: boolean
}

export const GiftInfoBlock: React.FC<Props> = ({ gift, historyData, isHistoryLoading }) => (
  <VStack spacing={6} align="stretch">
    <SimpleGrid columns={1} spacing={2}>
      {gift.attributes.map((attr, i) => (
        <AttributeItem key={i} attr={attr} />
      ))}
    </SimpleGrid>

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
            py={1.5}
          >
            {label}
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        <TabPanel px={0} pt={4}>
          <VStack spacing={5} align="stretch">
            <VStack align="stretch" spacing={0} bg="whiteAlpha.50" px={4} py={1} borderRadius="20px">
              <Flex justify="space-between" align="center" py={3}>
                <Text color="gray.500" fontSize="13px" fontWeight="700" textTransform="uppercase">Оценка</Text>
                <TonValue value={gift.estimatedPrice} fontSize="18px" />
              </Flex>
              <Box h="1px" bg="whiteAlpha.100" />
              <Flex justify="space-between" align="center" py={3}>
                <Text color="gray.500" fontSize="13px" fontWeight="700" textTransform="uppercase">Floor</Text>
                <TonValue value={gift.floorPrice} fontSize="18px" />
              </Flex>
            </VStack>

            <Box>
              <Text fontSize="10px" fontWeight="900" color="gray.600" mb={2} ml={1} textTransform="uppercase">
                Рыночные цены
              </Text>
              <Box bg="whiteAlpha.50" borderRadius="20px" px={4}>
                {gift.stats.map((stat, i) => (
                  <MarketStatRow key={i} stat={stat} />
                ))}
              </Box>
            </Box>
          </VStack>
        </TabPanel>

        <TabPanel px={0} pt={4}>
          {isHistoryLoading ? (
            <Center py={10}><Spinner color="brand.500" /></Center>
          ) : (
            <BlockchainHistory history={historyData} />
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  </VStack>
)