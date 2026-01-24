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
} from "@chakra-ui/react"
import { GiftItem, GiftAttribute, MarketStat, RecentSale } from "../../types/inventory"
import { NftExplorerDetails } from "../../types/explorer"
import InventoryService from "../../services/inventory"
import { BlockchainHistory } from "./BlockchainHistory"

interface GiftDetailDrawerProps {
    isOpen: boolean
    onClose: () => void
    gift: GiftItem | null
    isLoading: boolean
    isError: boolean
}

const PriceStat = ({ label, value, percent, isTon = false }: any) => (
    <Flex justify="space-between" align="center" w="100%" py={1}>
        <Text color="gray.500" fontSize="13px" fontWeight="600">{label}</Text>
        <HStack spacing={2}>
            <HStack spacing={1}>
                {isTon && <Text color="brand.500" fontWeight="900" fontSize="14px">💎</Text>}
                <Text fontWeight="800" fontSize="15px" color={percent?.startsWith("+") ? "green.300" : "white"}>{value}</Text>
            </HStack>
            {percent && (
                <Badge variant="subtle" colorScheme={percent.startsWith("+") ? "green" : "red"} fontSize="11px" borderRadius="6px">
                    {percent}
                </Badge>
            )}
        </HStack>
    </Flex>
)

const AttributeRow = ({ attr }: { attr: GiftAttribute }) => (
    <Flex justify="space-between" align="center" w="100%">
        <Text color="gray.500" fontSize="12px" fontWeight="600">{attr.trait_type}</Text>
        <HStack spacing={2}>
            <Text fontSize="13px" fontWeight="700" color="white">{attr.value}</Text>
            <Badge bg="whiteAlpha.200" color="whiteAlpha.700" fontSize="9px" borderRadius="4px">{attr.rarity_percent}%</Badge>
        </HStack>
    </Flex>
)

const MarketTableRow = ({ stat }: { stat: MarketStat }) => (
    <Flex justify="space-between" align="center" py="10px" borderBottom="1px solid" borderColor="whiteAlpha.50">
        <Text fontSize="13px" fontWeight="600" color="gray.300" flex={1}>{stat.label}</Text>
        <Text fontSize="13px" fontWeight="700" color="white" w="60px" textAlign="center">{stat.items_count}</Text>
        <HStack w="80px" justify="flex-end" spacing={1}>
            {stat.floor_price && <Text color="brand.500" fontSize="12px">💎</Text>}
            <Text fontSize="13px" fontWeight="800" color={stat.floor_price ? "white" : "gray.600"}>{stat.floor_price || "N/A"}</Text>
        </HStack>
    </Flex>
)

const SaleRow = ({ sale }: { sale: RecentSale }) => (
    <Flex justify="space-between" align="center" py="12px" borderBottom="1px solid" borderColor="whiteAlpha.50">
        <VStack align="start" spacing={0}>
            <Text fontSize="13px" fontWeight="800" color="white" noOfLines={1} maxW="180px">{sale.trait_value}</Text>
            <Text fontSize="11px" color="gray.500" fontWeight="600">{sale.date.split(" ")[0]} • {sale.platform}</Text>
        </VStack>
        <HStack spacing={1}>
            <Text color="brand.500" fontSize="11px">💎</Text>
            <Text fontSize="15px" fontWeight="900" color="white">{sale.price}</Text>
        </HStack>
    </Flex>
)

const GiftDetailDrawer: React.FC<GiftDetailDrawerProps> = ({ isOpen, onClose, gift, isLoading, isError }) => {
    const [activeSaleFilter, setActiveSaleFilter] = useState<string>("model")
    const [explorerData, setExplorerData] = useState<NftExplorerDetails | null>(null)
    const [isExplorerLoading, setIsExplorerLoading] = useState(false)

    // Загружаем данные из блокчейна при открытии модалки
    useEffect(() => {
        if (isOpen && gift) {
            setIsExplorerLoading(true)
            InventoryService.getNftBlockchainDetails(gift.id)
                .then(res => setExplorerData(res))
                .catch(() => setExplorerData(null))
                .finally(() => setIsExplorerLoading(false))
        }
    }, [isOpen, gift])

    const filteredSales = useMemo(() => {
        if (!gift?.recentSales) return []
        return gift.recentSales.filter(s => s.filter_category === activeSaleFilter)
    }, [gift, activeSaleFilter])

    const handleOpenFragment = () => {
        if (!gift) return
        window.Telegram?.WebApp?.openLink(`https://fragment.com/gift/${gift.id}`)
    }

    return (
        <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} scrollBehavior="inside">
            <DrawerOverlay backdropFilter="blur(15px)" bg="blackAlpha.800" />
            <DrawerContent borderTopRadius="32px" bg="#161920" color="white" maxH="95vh">
                <Box w="36px" h="4px" bg="whiteAlpha.400" borderRadius="full" mx="auto" mt={3} mb={1} />
                <DrawerCloseButton color="whiteAlpha.500" />

                <DrawerBody px={5} pt={2} pb={8}>
                    {isLoading ? (
                        <Center h="400px"><Spinner color="brand.500" size="xl" thickness="3px" /></Center>
                    ) : isError ? (
                        <Center h="300px"><Text color="red.400">Ошибка загрузки</Text></Center>
                    ) : gift && (
                        <VStack spacing={5} align="stretch">
                            {/* Шапка с названием */}
                            <Box mt={2}>
                                <Text fontSize="22px" fontWeight="900" lineHeight="1.2">{gift.name}</Text>
                                <Text color="gray.500" fontSize="13px" fontWeight="700" mt={1}>#{gift.num}</Text>
                            </Box>

                            {/* Картинка и атрибуты */}
                            <HStack spacing={4} align="center">
                                <Box boxSize="100px" borderRadius="20px" overflow="hidden" bg="whiteAlpha.100" flexShrink={0}>
                                    <Image src={gift.image} w="100%" h="100%" objectFit="cover" />
                                </Box>
                                <VStack flex={1} spacing={2}>
                                    {gift.attributes?.map((attr, i) => <AttributeRow key={i} attr={attr} />)}
                                </VStack>
                            </HStack>

                            {/* СИСТЕМА ВКЛАДОК */}
                            <Tabs variant="soft-rounded" colorScheme="purple" isFitted>
                                <TabList bg="whiteAlpha.50" p={1} borderRadius="16px">
                                    <Tab fontWeight="900" fontSize="12px" _selected={{ bg: "brand.500", color: "gray.900" }}>АНАЛИТИКА</Tab>
                                    <Tab fontWeight="900" fontSize="12px" _selected={{ bg: "brand.500", color: "gray.900" }}>БЛОКЧЕЙН</Tab>
                                </TabList>

                                <TabPanels>
                                    {/* Вкладка 1: Рыночная аналитика */}
                                    <TabPanel px={0} pt={5}>
                                        <VStack spacing={5} align="stretch">
                                            <VStack align="stretch" spacing={1} bg="whiteAlpha.50" p={4} borderRadius="20px">
                                                <PriceStat label="Примерная цена" value={`${gift.estimatedPrice}`} isTon />
                                                <PriceStat label="P/L (TON)" value="+6.55" percent="+62.42%" isTon />
                                            </VStack>

                                            <Box>
                                                <Text fontSize="11px" fontWeight="800" color="gray.600" textTransform="uppercase" mb={2} px={1}>Аналитика рынка</Text>
                                                <Box bg="whiteAlpha.50" borderRadius="20px" px={4}>
                                                    {gift.marketStats?.map((stat, i) => <MarketTableRow key={i} stat={stat} />)}
                                                </Box>
                                            </Box>

                                            <Box>
                                                <Text fontSize="11px" fontWeight="800" color="gray.600" textTransform="uppercase" mb={3} px={1}>Последние продажи</Text>
                                                <HStack bg="whiteAlpha.50" p="4px" borderRadius="14px" mb={3} spacing={1}>
                                                    {[{ id: "model", label: "Модель" }, { id: "backdrop", label: "Фон" }, { id: "model_backdrop", label: "Mix" }].map((btn) => (
                                                        <Box key={btn.id} as="button" flex={1} py="6px" borderRadius="10px" fontSize="11px" fontWeight="800"
                                                             bg={activeSaleFilter === btn.id ? "brand.500" : "transparent"}
                                                             color={activeSaleFilter === btn.id ? "gray.900" : "gray.400"}
                                                             onClick={() => setActiveSaleFilter(btn.id)}>{btn.label}</Box>
                                                    ))}
                                                </HStack>
                                                <Box bg="whiteAlpha.50" borderRadius="20px" px={4} minH="100px">
                                                    {filteredSales.length > 0 ? filteredSales.map((sale) => <SaleRow key={sale.id} sale={sale} />) :
                                                        <Center py={8}><Text fontSize="12px" color="gray.500">Нет данных</Text></Center>}
                                                </Box>
                                            </Box>
                                        </VStack>
                                    </TabPanel>

                                    {/* Вкладка 2: История в Блокчейне */}
                                    <TabPanel px={0} pt={5}>
                                        {isExplorerLoading ? (
                                            <Center py={10}><Spinner color="brand.500" /></Center>
                                        ) : explorerData ? (
                                            <VStack align="stretch" spacing={5}>
                                                <Box bg="whiteAlpha.50" borderRadius="20px" p={4}>
                                                    <Text fontSize="10px" color="gray.500" fontWeight="800" mb={1} textTransform="uppercase">NFT Address</Text>
                                                    <Text fontSize="12px" fontWeight="700" color="brand.500" isTruncated>{explorerData.info.address}</Text>
                                                </Box>
                                                <Box>
                                                    <Text fontSize="11px" fontWeight="800" color="gray.600" textTransform="uppercase" mb={4} px={1}>Blockchain Timeline</Text>
                                                    <BlockchainHistory history={explorerData.history} />
                                                </Box>
                                            </VStack>
                                        ) : (
                                            <Center py={10}><Text color="gray.500">Данные блокчейна недоступны</Text></Center>
                                        )}
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>

                            <Button
                                w="100%" h="54px" bg="brand.500" color="gray.900" borderRadius="18px"
                                fontWeight="900" fontSize="16px" onClick={handleOpenFragment} mt={2}
                            >
                                Открыть на Fragment
                            </Button>
                        </VStack>
                    )}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}

export default GiftDetailDrawer