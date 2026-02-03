import React, { useState, useMemo, useEffect } from "react"
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Flex,
  Spinner,
  Center,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  SimpleGrid,
} from "@chakra-ui/react"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { GiftItem } from "../../types/inventory"
import { NftExplorerDetails } from "../../types/explorer"
import InventoryService from "../../services/inventory"
import { BlockchainHistory } from "./BlockchainHistory"
import { TonIconBlue } from "../Shared/Icons"

interface GiftDetailContentProps {
  gift: GiftItem | null
  isLoading: boolean
  isError: boolean
  onBack: () => void
}

export const GiftDetailContent: React.FC<GiftDetailContentProps> = ({
  gift,
  isLoading,
  isError,
  onBack,
}) => {
  const [activeSaleFilter, setActiveSaleFilter] = useState<string>("model")
  const [explorerData, setExplorerData] = useState<NftExplorerDetails | null>(null)
  const [isExplorerLoading, setIsExplorerLoading] = useState(false)

  useEffect(() => {
    if (gift) {
      setIsExplorerLoading(true)
      InventoryService.getNftBlockchainDetails(gift.id)
        .then((res) => setExplorerData(res))
        .catch(() => setExplorerData(null))
        .finally(() => setIsExplorerLoading(false))
    }
  }, [gift])

  const filteredSales = useMemo(() => {
    if (!gift?.recentSales) return []
    return gift.recentSales.filter((s) => s.filter_category === activeSaleFilter)
  }, [gift, activeSaleFilter])

  if (isLoading) {
    return (
      <Center h="400px">
        <Spinner color="brand.500" size="xl" thickness="3px" />
      </Center>
    )
  }

  if (isError || !gift) {
    return (
      <Center h="300px">
        <VStack spacing={4}>
          <Text color="red.400" fontWeight="700">Ошибка загрузки данных</Text>
          <Button
            onClick={onBack}
            variant="outline"
            colorScheme="whiteAlpha"
            borderRadius="14px"
          >
            Вернуться назад
          </Button>
        </VStack>
      </Center>
    )
  }

  return (
    <Box>
      {/* Header */}
      <HStack mb={4} spacing={3}>
        <IconButton
          aria-label="Back"
          icon={<ArrowBackIcon />}
          variant="ghost"
          color="white"
          borderRadius="full"
          onClick={onBack}
          _active={{ bg: "whiteAlpha.200" }}
        />
        <VStack align="start" spacing={0}>
          <Text fontSize="20px" fontWeight="900" lineHeight="1.2">
            {gift.name}
          </Text>
          <Badge colorScheme="purple" borderRadius="6px" px={2}>
            #{gift.num}
          </Badge>
        </VStack>
      </HStack>

      {/* Hero Section */}
      <Flex gap={4} mb={6}>
        <Box
          boxSize="120px"
          borderRadius="24px"
          overflow="hidden"
          bg="whiteAlpha.50"
          flexShrink={0}
          border="1px solid"
          borderColor="whiteAlpha.100"
        >
          <Image src={gift.image} w="100%" h="100%" objectFit="cover" />
        </Box>
        <VStack flex={1} spacing={2} align="stretch">
          {gift.attributes?.map((attr, i) => (
            <Box
              key={i}
              bg="whiteAlpha.50"
              p={2}
              px={3}
              borderRadius="12px"
              border="1px solid"
              borderColor="whiteAlpha.50"
            >
              <Text
                color="whiteAlpha.400"
                fontSize="9px"
                fontWeight="900"
                textTransform="uppercase"
                letterSpacing="0.5px"
              >
                {attr.trait_type}
              </Text>
              <Flex justify="space-between" align="center">
                <Text fontSize="12px" fontWeight="800" isTruncated color="white">
                  {attr.value || "—"}
                </Text>
                <Text color="brand.500" fontSize="11px" fontWeight="900">
                  {attr.rarity_percent}%
                </Text>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Flex>

      {/* Tabs */}
      <Tabs variant="unstyled">
        <TabList bg="whiteAlpha.50" p="4px" borderRadius="16px" mb={4}>
          {["АНАЛИТИКА", "ИСТОРИЯ"].map((label) => (
            <Tab
              key={label}
              flex={1}
              fontSize="11px"
              fontWeight="900"
              borderRadius="12px"
              color="whiteAlpha.500"
              _selected={{ bg: "brand.500", color: "black" }}
              py={2}
            >
              {label}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {/* Analytics Panel */}
          <TabPanel px={0}>
            <VStack align="stretch" spacing={5}>
              <Box bg="whiteAlpha.50" p={4} borderRadius="20px" border="1px solid" borderColor="whiteAlpha.100">
                <Flex justify="space-between" align="center" mb={3}>
                  <Text color="whiteAlpha.500" fontWeight="700" fontSize="13px">Оценка</Text>
                  <HStack spacing={1.5}>
                    <Text fontWeight="900" fontSize="18px">
                      {gift.estimatedPrice || "—"}
                    </Text>
                    {gift.estimatedPrice && <TonIconBlue boxSize="16px" />}
                  </HStack>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text color="whiteAlpha.500" fontWeight="700" fontSize="13px">Floor</Text>
                  <HStack spacing={1.5}>
                    <Text fontWeight="900" fontSize="18px">
                      {gift.floorPrice || "—"}
                    </Text>
                    {gift.floorPrice && <TonIconBlue boxSize="16px" />}
                  </HStack>
                </Flex>
              </Box>

              <Box>
                <Text
                  fontSize="10px"
                  fontWeight="900"
                  color="whiteAlpha.400"
                  mb={3}
                  ml={1}
                  letterSpacing="1px"
                >
                  РЫНОЧНЫЕ ПАРАМЕТРЫ
                </Text>
                <SimpleGrid columns={2} spacing={3}>
                  {gift.marketStats?.map((stat, i) => (
                    <Box
                      key={i}
                      bg="whiteAlpha.50"
                      p={3}
                      borderRadius="18px"
                      border="1px solid"
                      borderColor="whiteAlpha.50"
                    >
                      <Text
                        fontSize="9px"
                        fontWeight="900"
                        color="whiteAlpha.400"
                        mb={1}
                        textTransform="uppercase"
                      >
                        {stat.label}
                      </Text>
                      <HStack spacing={1} mb={0.5}>
                        <Text fontSize="14px" fontWeight="900">
                          {stat.floor_price || "—"}
                        </Text>
                        {stat.floor_price && (
                          <Text as="span" fontSize="10px" fontWeight="900" color="brand.500">
                            TON
                          </Text>
                        )}
                      </HStack>
                      <Text fontSize="10px" color="whiteAlpha.500" fontWeight="700">
                        {stat.items_count} шт. в продаже
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            </VStack>
          </TabPanel>

          {/* History Panel */}
          <TabPanel px={0}>
            {isExplorerLoading ? (
              <Center py={10}>
                <Spinner color="brand.500" />
              </Center>
            ) : (
              <BlockchainHistory history={explorerData?.history || []} />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Action Button */}
      <Button
        mt={6}
        w="100%"
        h="56px"
        bg="#0088CC"
        color="white"
        borderRadius="20px"
        fontWeight="900"
        fontSize="16px"
        _active={{ transform: "scale(0.98)", bg: "#0077B3" }}
        onClick={() =>
          window.Telegram?.WebApp?.openLink(
            `https://fragment.com/gift/${gift.slug}-${gift.num}`
          )
        }
      >
        Открыть на Fragment
      </Button>
    </Box>
  )
}