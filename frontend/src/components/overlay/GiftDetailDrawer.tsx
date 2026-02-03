import React, { useState, useMemo, useEffect } from "react"
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
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
  Avatar,
  Icon,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { GiftItem, GiftAttribute, MarketStat, RecentSale } from "../../types/inventory"
import { NftExplorerDetails } from "../../types/explorer"
import InventoryService from "../../services/inventory"
import { BlockchainHistory } from "./BlockchainHistory"
import { UserIcon, GiftIconMini } from "../Shared/Icons" // Добавили GiftIconMini

interface GiftDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  gift: GiftItem | null
  isLoading: boolean
  isError: boolean
}

// Фирменная иконка TON
const TonIcon = ({ size = 14, color = "white" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <path
          d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
          fill="#0088CC"
      />
      <path
          d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6621 19.424 14.42 22.4673L25.9814 42.4834C26.9205 44.1091 29.0791 44.1091 30.0182 42.4834L41.5807 22.4673C43.3375 19.424 41.0772 15.6277 37.5603 15.6277ZM26.043 35.5398L19.5447 24.2882C18.8471 23.08 19.7188 21.5544 21.1127 21.5544H34.8851C36.279 21.5544 37.1507 23.08 36.4531 24.2882L29.9548 35.5398C29.0638 37.0833 26.8797 37.0833 26.043 35.5398Z"
          fill={color}
      />
    </svg>
)

const PriceStat = ({ label, value, percent, isTon = false }: any) => (
    <Flex justify="space-between" align="center" w="100%" py={2}>
      <Text
          color="gray.500"
          fontSize="13px"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing="0.5px"
      >
        {label}
      </Text>
      <HStack spacing={3}>
        <HStack spacing={1.5}>
          <Text
              fontWeight="900"
              fontSize="18px"
              color={percent?.startsWith("+") ? "green.300" : "white"}
          >
            {value}
          </Text>
          {isTon && <TonIcon size={16} />}
        </HStack>
        {percent && (
            <Badge
                variant="solid"
                bg={percent.startsWith("+") ? "green.500" : "red.500"}
                color="white"
                fontSize="10px"
                borderRadius="6px"
                px={2}
            >
              {percent}
            </Badge>
        )}
      </HStack>
    </Flex>
)

const AttributeRow = ({ attr }: { attr: GiftAttribute }) => (
    <Flex
        justify="space-between"
        align="center"
        w="100%"
        bg="whiteAlpha.50"
        p={2}
        borderRadius="10px"
    >
      <Text color="gray.500" fontSize="11px" fontWeight="800" textTransform="uppercase">
        {attr.trait_type}
      </Text>
      <HStack spacing={2}>
        <Text fontSize="12px" fontWeight="800" color="white">
          {attr.value}
        </Text>
        <Text color="brand.500" fontSize="10px" fontWeight="900">
          {attr.rarity_percent}%
        </Text>
      </HStack>
    </Flex>
)

const MarketTableRow = ({ stat }: { stat: MarketStat }) => (
    <Flex
        justify="space-between"
        align="center"
        py="12px"
        borderBottom="1px solid"
        borderColor="whiteAlpha.50"
    >
      <Text fontSize="13px" fontWeight="700" color="gray.300" flex={1}>
        {stat.label}
      </Text>
      <Text fontSize="13px" fontWeight="800" color="whiteAlpha.600" w="60px" textAlign="center">
        {stat.items_count}
      </Text>
      <HStack w="90px" justify="flex-end" spacing={1.5}>
        <Text fontSize="14px" fontWeight="900" color={stat.floor_price ? "white" : "gray.600"}>
          {stat.floor_price || "—"}
        </Text>
        {stat.floor_price && <TonIcon size={12} />}
      </HStack>
    </Flex>
)

const SaleRow = ({ sale }: { sale: RecentSale }) => (
    <Flex
        justify="space-between"
        align="center"
        py="14px"
        borderBottom="1px solid"
        borderColor="whiteAlpha.50"
    >
      <HStack spacing={3} flex={1}>
        <Avatar
            src={sale.avatar_url}
            size="sm"
            borderRadius="8px"
            bg="whiteAlpha.100"
            icon={<Spinner size="xs" />}
        />
        <VStack align="start" spacing={0} overflow="hidden">
          <Text fontSize="14px" fontWeight="800" color="white" noOfLines={1}>
            {sale.trait_value}
          </Text>
          <Text fontSize="11px" color="gray.500" fontWeight="700">
            {sale.date.split(" ")[0]} • {sale.platform.toUpperCase()}
          </Text>
        </VStack>
      </HStack>

      <HStack bg="whiteAlpha.100" px={3} py={1.5} borderRadius="12px" spacing={1.5} ml={2}>
        <Text fontSize="15px" fontWeight="900" color="brand.500">
          {sale.price}
        </Text>
        <TonIcon size={12} />
      </HStack>
    </Flex>
)

// МИНИМАЛИСТИЧНЫЙ блок владельца
const OwnerRow = ({ username, onClick }: { username: string; onClick: () => void }) => (
    <Flex
        align="center"
        justify="space-between"
        bg="whiteAlpha.50"
        px="10px"
        py="8px"
        borderRadius="16px"
        cursor="pointer"
        transition="0.2s"
        _active={{ transform: "scale(0.98)", bg: "whiteAlpha.100" }}
        onClick={onClick}
    >
      <HStack spacing={2.5}>
        <Avatar
            size="xs"
            src={`https://poso.see.tg/api/avatar/${username}`}
            name={username}
            borderRadius="8px"
        />
        <Text fontSize="13px" fontWeight="700" color="whiteAlpha.900">
          @{username}
        </Text>
      </HStack>

      {/* Блок с количеством подарков (имитация, если данных нет - можно скрыть или поставить 1) */}
      <HStack spacing={1.5} bg="whiteAlpha.100" px="8px" py="3px" borderRadius="10px">
        <GiftIconMini boxSize="12px" color="brand.500" />
        <Text fontSize="11px" fontWeight="900" color="white">
          Профиль
        </Text>
      </HStack>
    </Flex>
)

const GiftDetailDrawer: React.FC<GiftDetailDrawerProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             gift,
                                                             isLoading,
                                                             isError,
                                                           }) => {
  const navigate = useNavigate()
  const [activeSaleFilter, setActiveSaleFilter] = useState<string>("model")
  const [explorerData, setExplorerData] = useState<NftExplorerDetails | null>(null)
  const [isExplorerLoading, setIsExplorerLoading] = useState(false)

  useEffect(() => {
    if (isOpen && gift) {
      setIsExplorerLoading(true)
      InventoryService.getNftBlockchainDetails(gift.id)
          .then((res) => setExplorerData(res))
          .catch(() => setExplorerData(null))
          .finally(() => setIsExplorerLoading(false))
    }
  }, [isOpen, gift])

  const filteredSales = useMemo(() => {
    if (!gift?.recentSales) return []
    return gift.recentSales.filter((s) => s.filter_category === activeSaleFilter)
  }, [gift, activeSaleFilter])

  const handleOpenFragment = () => {
    if (!gift) return
    window.Telegram?.WebApp?.openLink(`https://fragment.com/gift/${gift.id}`)
  }

  const handleOwnerClick = () => {
    if (!gift?.ownerUsername) return
    onClose()
    navigate(`/user/${gift.ownerUsername}`, {
      state: {
        username: gift.ownerUsername,
        name: gift.ownerUsername,
        avatarUrl: `https://poso.see.tg/api/avatar/${gift.ownerUsername}`
      }
    })
  }

  return (
      <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} scrollBehavior="inside">
        <DrawerOverlay backdropFilter="blur(20px)" bg="blackAlpha.800" />
        <DrawerContent borderTopRadius="36px" bg="#0F1115" color="white" maxH="92vh">
          <Box w="40px" h="5px" bg="whiteAlpha.200" borderRadius="full" mx="auto" mt={4} mb={2} />
          <DrawerCloseButton top={6} right={6} color="whiteAlpha.400" />

          <DrawerBody px={6} pt={2} pb={10}>
            {isLoading ? (
                <Center h="400px">
                  <Spinner color="brand.500" size="xl" thickness="3px" />
                </Center>
            ) : isError ? (
                <Center h="300px">
                  <Text color="red.400">Ошибка загрузки</Text>
                </Center>
            ) : (
                gift && (
                    <VStack spacing={5} align="stretch">
                      {/* Заголовок */}
                      <Box mt={2}>
                        <Text fontSize="22px" fontWeight="900" letterSpacing="-0.5px">
                          {gift.name}
                        </Text>
                        <HStack mt={1} spacing={2}>
                          <Badge colorScheme="purple" variant="subtle" borderRadius="6px" px={2}>
                            #{gift.num}
                          </Badge>
                          <Text color="gray.500" fontSize="12px" fontWeight="700">
                            Telegram Gift NFT
                          </Text>
                        </HStack>
                      </Box>

                      {/* БЛОК ВЛАДЕЛЬЦА (Минималистичный) */}
                      {gift.ownerUsername && (
                          <OwnerRow username={gift.ownerUsername} onClick={handleOwnerClick} />
                      )}

                      {/* Картинка и основные свойства */}
                      <Flex gap={4}>
                        <Box
                            boxSize="110px"
                            borderRadius="20px"
                            overflow="hidden"
                            bg="whiteAlpha.50"
                            flexShrink={0}
                        >
                          <Image src={gift.image} w="100%" h="100%" objectFit="cover" />
                        </Box>
                        <VStack flex={1} spacing={1.5} justify="center">
                          {gift.attributes?.map((attr, i) => (
                              <AttributeRow key={i} attr={attr} />
                          ))}
                        </VStack>
                      </Flex>

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
                              <VStack
                                  align="stretch"
                                  spacing={0}
                                  bg="whiteAlpha.50"
                                  px={4}
                                  py={1}
                                  borderRadius="20px"
                              >
                                <PriceStat label="Оценка" value={gift.estimatedPrice} isTon />
                                <Box h="1px" bg="whiteAlpha.100" />
                                <PriceStat label="Доход (P/L)" value="+6.55" percent="+62.4%" isTon />
                              </VStack>

                              <Box>
                                <Text fontSize="10px" fontWeight="900" color="gray.600" mb={2} ml={1} textTransform="uppercase">
                                  Рыночные цены
                                </Text>
                                <Box bg="whiteAlpha.50" borderRadius="20px" px={4}>
                                  {gift.marketStats?.map((stat, i) => (
                                      <MarketTableRow key={i} stat={stat} />
                                  ))}
                                </Box>
                              </Box>

                              <Box>
                                <Text fontSize="10px" fontWeight="900" color="gray.600" mb={2} ml={1} textTransform="uppercase">
                                  Последние продажи
                                </Text>
                                <HStack bg="whiteAlpha.50" p="4px" borderRadius="14px" mb={3}>
                                  {[
                                    { id: "model", label: "Модель" },
                                    { id: "backdrop", label: "Фон" },
                                    { id: "model_backdrop", label: "Микс" },
                                  ].map((btn) => (
                                      <Box
                                          key={btn.id}
                                          as="button"
                                          flex={1}
                                          py="6px"
                                          borderRadius="10px"
                                          fontSize="10px"
                                          fontWeight="800"
                                          bg={activeSaleFilter === btn.id ? "whiteAlpha.200" : "transparent"}
                                          color={activeSaleFilter === btn.id ? "white" : "gray.500"}
                                          onClick={() => setActiveSaleFilter(btn.id)}
                                      >
                                        {btn.label}
                                      </Box>
                                  ))}
                                </HStack>
                                <VStack
                                    align="stretch"
                                    spacing={0}
                                    bg="whiteAlpha.50"
                                    px={4}
                                    borderRadius="20px"
                                >
                                  {filteredSales.length > 0 ? (
                                      filteredSales.map((sale) => <SaleRow key={sale.id} sale={sale} />)
                                  ) : (
                                      <Center py={8}>
                                        <Text fontSize="12px" color="gray.600" fontWeight="700">
                                          Нет данных
                                        </Text>
                                      </Center>
                                  )}
                                </VStack>
                              </Box>
                            </VStack>
                          </TabPanel>

                          <TabPanel px={0} pt={4}>
                            {isExplorerLoading ? (
                                <Center py={10}>
                                  <Spinner color="brand.500" />
                                </Center>
                            ) : explorerData ? (
                                <VStack align="stretch" spacing={5}>
                                  <Box
                                      bg="whiteAlpha.50"
                                      borderRadius="18px"
                                      p={3}
                                      border="1px solid"
                                      borderColor="whiteAlpha.100"
                                  >
                                    <Text fontSize="9px" color="gray.600" fontWeight="900" mb={1}>
                                      NFT ADDRESS
                                    </Text>
                                    <Text fontSize="11px" fontWeight="700" color="blue.300" isTruncated>
                                      {explorerData.info.address}
                                    </Text>
                                  </Box>
                                  <BlockchainHistory history={explorerData.history} />
                                </VStack>
                            ) : (
                                <Center py={10}>
                                  <Text color="gray.500">Данные не найдены</Text>
                                </Center>
                            )}
                          </TabPanel>
                        </TabPanels>
                      </Tabs>

                      <Button
                          w="100%"
                          h="50px"
                          bg="#0088CC"
                          color="white"
                          borderRadius="18px"
                          fontWeight="900"
                          fontSize="15px"
                          onClick={handleOpenFragment}
                          _active={{ transform: "scale(0.97)" }}
                      >
                        Купить на Fragment
                      </Button>
                    </VStack>
                )
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
  )
}

export default GiftDetailDrawer