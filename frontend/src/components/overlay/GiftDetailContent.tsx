import React, { useState, useMemo, useEffect } from "react"
import {
  Box, Image, Text, VStack, HStack, Badge, Button, Flex, Spinner, Center,
  Tabs, TabList, TabPanels, Tab, TabPanel, IconButton, SimpleGrid, Avatar,
} from "@chakra-ui/react"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { GiftItem, MarketStat, RecentSale } from "../../types/inventory"
import { NftExplorerDetails } from "../../types/explorer"
import InventoryService from "../../services/inventory"
import { BlockchainHistory } from "./BlockchainHistory"
import { TonIconBlue, GiftIconMini } from "../Shared/Icons"
import { useNavigate } from "react-router-dom"

interface GiftDetailContentProps {
  gift: GiftItem | null
  isLoading: boolean
  isError: boolean
  onBack?: () => void // Сделаем опциональным для Drawer
}

const PriceStat = ({ label, value, percent, isTon = false }: any) => (
  <Flex justify="space-between" align="center" w="100%" py={2}>
    <Text color="gray.500" fontSize="13px" fontWeight="700" textTransform="uppercase">
      {label}
    </Text>
    <HStack spacing={3}>
      <HStack spacing={1.5}>
        <Text fontWeight="900" fontSize="18px" color={percent?.startsWith("+") ? "green.300" : "white"}>
          {value}
        </Text>
        {isTon && <TonIconBlue boxSize="16px" />}
      </HStack>
      {percent && (
        <Badge variant="solid" bg={percent.startsWith("+") ? "green.500" : "red.500"} color="white" fontSize="10px" borderRadius="6px" px={2}>
          {percent}
        </Badge>
      )}
    </HStack>
  </Flex>
)

const MarketTableRow = ({ stat }: { stat: MarketStat }) => (
  <Flex justify="space-between" align="center" py="12px" borderBottom="1px solid" borderColor="whiteAlpha.50">
    <Text fontSize="13px" fontWeight="700" color="gray.300" flex={1}>{stat.label}</Text>
    <Text fontSize="13px" fontWeight="800" color="whiteAlpha.600" w="60px" textAlign="center">{stat.items_count}</Text>
    <HStack w="90px" justify="flex-end" spacing={1.5}>
      <Text fontSize="14px" fontWeight="900" color={stat.floor_price ? "white" : "gray.600"}>
        {stat.floor_price || "—"}
      </Text>
      {stat.floor_price && <TonIconBlue boxSize="12px" />}
    </HStack>
  </Flex>
)

const SaleRow = ({ sale }: { sale: RecentSale }) => (
  <Flex justify="space-between" align="center" py="14px" borderBottom="1px solid" borderColor="whiteAlpha.50">
    <HStack spacing={3} flex={1}>
      <Avatar src={sale.avatar_url} size="sm" borderRadius="8px" bg="whiteAlpha.100" />
      <VStack align="start" spacing={0} overflow="hidden">
        <Text fontSize="14px" fontWeight="800" color="white" noOfLines={1}>{sale.trait_value}</Text>
        <Text fontSize="11px" color="gray.500" fontWeight="700">
          {sale.date} • {sale.platform.toUpperCase()}
        </Text>
      </VStack>
    </HStack>
    <HStack bg="whiteAlpha.100" px={3} py={1.5} borderRadius="12px" spacing={1.5} ml={2}>
      <Text fontSize="15px" fontWeight="900" color="brand.500">{sale.price}</Text>
      <TonIconBlue boxSize="12px" />
    </HStack>
  </Flex>
)

export const GiftDetailContent: React.FC<GiftDetailContentProps> = ({ gift, isLoading, isError, onBack }) => {
  const navigate = useNavigate()
  const [activeSaleFilter, setActiveSaleFilter] = useState<string>("model")
  const [explorerData, setExplorerData] = useState<NftExplorerDetails | null>(null)
  const [isExplorerLoading, setIsExplorerLoading] = useState(false)

  useEffect(() => {
    if (gift) {
      setIsExplorerLoading(true)
      InventoryService.getNftBlockchainDetails(gift.id)
        .then(setExplorerData)
        .catch(() => setExplorerData(null))
        .finally(() => setIsExplorerLoading(false))
    }
  }, [gift])

  const filteredSales = useMemo(() => {
    if (!gift?.recentSales) return []
    return gift.recentSales.filter((s) => s.filter_category === activeSaleFilter)
  }, [gift, activeSaleFilter])

  if (isLoading) return <Center h="400px"><Spinner color="brand.500" size="xl" thickness="3px" /></Center>
  if (isError || !gift) return <Center h="300px"><Text color="red.400">Ошибка загрузки</Text></Center>

  return (
    <Box>
      <HStack mb={4} spacing={3} justify="space-between">
        <HStack spacing={3}>
          {onBack && (
            <IconButton
              aria-label="Back" icon={<ArrowBackIcon />} variant="ghost" color="white"
              borderRadius="full" onClick={onBack}
            />
          )}
          <VStack align="start" spacing={0}>
            <Text fontSize="20px" fontWeight="900" lineHeight="1.2">{gift.name}</Text>
            <Badge colorScheme="purple" borderRadius="6px" px={2}>#{gift.num}</Badge>
          </VStack>
        </HStack>

        {gift.ownerUsername && (
          <HStack
            as="button" bg="whiteAlpha.100" p="6px" pr="12px" borderRadius="14px" spacing={2}
            onClick={() => navigate(`/user/${gift.ownerUsername}`)}
          >
            <Avatar size="xs" src={`https://poso.see.tg/api/avatar/${gift.ownerUsername}`} borderRadius="8px" />
            <Text fontSize="11px" fontWeight="900">@{gift.ownerUsername}</Text>
          </HStack>
        )}
      </HStack>

      <Flex gap={4} mb={6}>
        <Box boxSize="110px" borderRadius="24px" overflow="hidden" bg="whiteAlpha.50" flexShrink={0}>
          <Image src={gift.image} w="100%" h="100%" objectFit="cover" />
        </Box>
        <VStack flex={1} spacing={1.5} justify="center">
          {gift.attributes?.map((attr, i) => (
            <Flex key={i} justify="space-between" align="center" w="100%" bg="whiteAlpha.50" p={2} borderRadius="10px">
              <Text color="gray.500" fontSize="10px" fontWeight="800" textTransform="uppercase">{attr.trait_type}</Text>
              <HStack spacing={2}>
                <Text fontSize="11px" fontWeight="800">{attr.value}</Text>
                <Text color="brand.500" fontSize="10px" fontWeight="900">{attr.rarity_percent}%</Text>
              </HStack>
            </Flex>
          ))}
        </VStack>
      </Flex>

      <Tabs variant="unstyled">
        <TabList bg="whiteAlpha.50" p="4px" borderRadius="16px" mb={4}>
          {["АНАЛИТИКА", "ИСТОРИЯ"].map((label) => (
            <Tab key={label} flex={1} fontSize="11px" fontWeight="900" borderRadius="12px" color="whiteAlpha.500" _selected={{ bg: "brand.500", color: "black" }} py={2}>
              {label}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <VStack align="stretch" spacing={5}>
              <VStack align="stretch" spacing={0} bg="whiteAlpha.50" px={4} py={1} borderRadius="20px">
                <PriceStat label="Оценка" value={gift.estimatedPrice} isTon />
                <Box h="1px" bg="whiteAlpha.100" />
                <PriceStat label="Floor" value={gift.floorPrice} isTon />
              </VStack>

              <Box>
                <Text fontSize="10px" fontWeight="900" color="gray.600" mb={2} ml={1} textTransform="uppercase">Рыночные цены</Text>
                <Box bg="whiteAlpha.50" borderRadius="20px" px={4}>
                  {gift.marketStats?.map((stat, i) => <MarketTableRow key={i} stat={stat} />)}
                </Box>
              </Box>

              <Box>
                <Text fontSize="10px" fontWeight="900" color="gray.600" mb={2} ml={1} textTransform="uppercase">Последние продажи</Text>
                <HStack bg="whiteAlpha.50" p="4px" borderRadius="14px" mb={3}>
                  {['model', 'backdrop', 'pattern'].map((type) => (
                    <Box
                      key={type} as="button" flex={1} py="6px" borderRadius="10px" fontSize="10px" fontWeight="800"
                      bg={activeSaleFilter === type ? "whiteAlpha.200" : "transparent"}
                      onClick={() => setActiveSaleFilter(type)}
                    >
                      {type.toUpperCase()}
                    </Box>
                  ))}
                </HStack>
                <Box bg="whiteAlpha.50" px={4} borderRadius="20px">
                  {filteredSales.length > 0 ? (
                    filteredSales.map((sale) => <SaleRow key={sale.id} sale={sale} />)
                  ) : <Center py={8}><Text fontSize="12px" color="gray.600">Нет данных</Text></Center>}
                </Box>
              </Box>
            </VStack>
          </TabPanel>
          <TabPanel px={0}>
            {isExplorerLoading ? <Center py={10}><Spinner color="brand.500" /></Center> : <BlockchainHistory history={explorerData?.history || []} />}
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Button
        mt={6} w="100%" h="56px" bg="#0088CC" color="white" borderRadius="20px" fontWeight="900"
        onClick={() => window.Telegram?.WebApp?.openLink(`https://fragment.com/gift/${gift.slug}-${gift.num}`)}
      >
        Открыть на Fragment
      </Button>
    </Box>
  )
}