import React, { useState, useMemo } from "react"
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
} from "@chakra-ui/react"
import { GiftItem, GiftAttribute, MarketStat, RecentSale } from "../../types/inventory"

interface GiftDetailDrawerProps {
    isOpen: boolean
    onClose: () => void
    gift: GiftItem | null
    isLoading: boolean
    isError: boolean
}

// Вспомогательный компонент для строк цены (верхний блок)
const PriceStat = ({
                       label,
                       value,
                       percent,
                       isTon = false,
                   }: {
    label: string
    value: string
    percent?: string
    isTon?: boolean
}) => (
    <Flex justify="space-between" align="center" w="100%" py={1}>
        <Text color="gray.500" fontSize="13px" fontWeight="600">
            {label}
        </Text>
        <HStack spacing={2}>
            <HStack spacing={1}>
                {isTon && <Text color="brand.500" fontWeight="900" fontSize="14px">💎</Text>}
                <Text fontWeight="800" fontSize="15px" color={percent?.startsWith("+") ? "green.300" : "white"}>
                    {value}
                </Text>
            </HStack>
            {percent && (
                <Badge variant="subtle" colorScheme={percent.startsWith("+") ? "green" : "red"} fontSize="11px" borderRadius="6px">
                    {percent}
                </Badge>
            )}
        </HStack>
    </Flex>
)

// Вспомогательный компонент для атрибутов (Model, Backdrop и т.д.)
const AttributeRow = ({ attr }: { attr: GiftAttribute }) => (
    <Flex justify="space-between" align="center" w="100%">
        <Text color="gray.500" fontSize="12px" fontWeight="600">
            {attr.trait_type}
        </Text>
        <HStack spacing={2}>
            <Text fontSize="13px" fontWeight="700" color="white">
                {attr.value}
            </Text>
            <Badge bg="whiteAlpha.200" color="whiteAlpha.700" fontSize="9px" borderRadius="4px">
                {attr.rarity_percent}%
            </Badge>
        </HStack>
    </Flex>
)

// Вспомогательный компонент для аналитики рынка
const MarketTableRow = ({ stat }: { stat: MarketStat }) => (
    <Flex justify="space-between" align="center" py="10px" borderBottom="1px solid" borderColor="whiteAlpha.50">
        <Text fontSize="13px" fontWeight="600" color="gray.300" flex={1}>
            {stat.label}
        </Text>
        <Text fontSize="13px" fontWeight="700" color="white" w="60px" textAlign="center">
            {stat.items_count}
        </Text>
        <HStack w="80px" justify="flex-end" spacing={1}>
            {stat.floor_price && <Text color="brand.500" fontSize="12px">💎</Text>}
            <Text fontSize="13px" fontWeight="800" color={stat.floor_price ? "white" : "gray.600"}>
                {stat.floor_price ? stat.floor_price : "N/A"}
            </Text>
        </HStack>
    </Flex>
)

// Вспомогательный компонент для строки недавней продажи
const SaleRow = ({ sale }: { sale: RecentSale }) => {
    // Функция для преобразования ссылки из JSON в прямую ссылку на .webp картинку
    const getImageUrl = (url: string) => {
        if (!url) return "";
        const slug = url.split('/').pop(); // забирает "trappedheart-8440"
        return `https://nft.fragment.com/gift/${slug}.webp`;
    };

    return (
        <Flex justify="space-between" align="center" py="12px" borderBottom="1px solid" borderColor="whiteAlpha.50">
            <HStack spacing={3} flex={1}>
                <Box boxSize="36px" borderRadius="8px" overflow="hidden" bg="whiteAlpha.100" flexShrink={0}>
                    <Image
                        src={getImageUrl(sale.avatar_url)}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                        fallback={<Box bg="whiteAlpha.200" w="100%" h="100%" />}
                    />
                </Box>
                <VStack align="start" spacing={0} overflow="hidden">
                    {/* Используем sale.name вместо sale.trait_value для отображения номера подарка */}
                    <Text fontSize="12px" fontWeight="800" color="white" isTruncated maxW="170px">
                        {sale.name}
                    </Text>
                    <Text fontSize="10px" color="gray.500" fontWeight="600">
                        {sale.date.split(" ")[0]} • {sale.platform}
                    </Text>
                </VStack>
            </HStack>
            <HStack spacing={1} flexShrink={0}>
                <Text color="brand.500" fontSize="11px">💎</Text>
                <Text fontSize="14px" fontWeight="900" color="white">
                    {sale.price}
                </Text>
            </HStack>
        </Flex>
    );
};

const GiftDetailDrawer: React.FC<GiftDetailDrawerProps> = ({ isOpen, onClose, gift, isLoading, isError }) => {
    const [activeFilter, setActiveFilter] = useState<string>("model")

    const filteredSales = useMemo(() => {
        if (!gift?.recentSales) return []
        return gift.recentSales.filter(s => s.filter_category === activeFilter)
    }, [gift, activeFilter])

    const handleOpenFragment = () => {
        if (!gift) return
        window.Telegram?.WebApp?.openLink(`https://fragment.com/gift/${gift.id}`)
    }

    // Заглушка для P/L (в реале можно считать из данных)
    const mockPL = { ton: "6.55", tonPercent: "+62.42%" }

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
                        <Center h="300px"><Text color="red.400">Ошибка загрузки данных</Text></Center>
                    ) : (
                        gift && (
                            <VStack spacing={5} align="stretch">
                                <Box mt={2}>
                                    <Text fontSize="22px" fontWeight="900" lineHeight="1.2">{gift.name}</Text>
                                    <Text color="gray.500" fontSize="13px" fontWeight="700" mt={1}>#{gift.num}</Text>
                                </Box>

                                {/* Блок цены и P/L */}
                                <VStack align="stretch" spacing={1} bg="whiteAlpha.50" p={4} borderRadius="20px">
                                    <PriceStat label="Примерная цена" value={`${gift.estimatedPrice}`} isTon />
                                    <PriceStat label="P/L (TON)" value={mockPL.ton} percent={mockPL.tonPercent} isTon />
                                </VStack>

                                {/* Изображение и атрибуты */}
                                <HStack spacing={4} align="center">
                                    <Box boxSize="100px" borderRadius="20px" overflow="hidden" bg="whiteAlpha.100" flexShrink={0}>
                                        <Image src={gift.image} w="100%" h="100%" objectFit="cover" />
                                    </Box>
                                    <VStack flex={1} spacing={2}>
                                        {gift.attributes?.map((attr, i) => <AttributeRow key={i} attr={attr} />)}
                                    </VStack>
                                </HStack>

                                {/* Аналитика рынка */}
                                <Box>
                                    <Text fontSize="11px" fontWeight="800" color="gray.600" textTransform="uppercase" mb={2} px={1}>Аналитика рынка</Text>
                                    <Box bg="whiteAlpha.50" borderRadius="20px" px={4}>
                                        {gift.marketStats?.map((stat, i) => <MarketTableRow key={i} stat={stat} />)}
                                    </Box>
                                </Box>

                                {/* Последние продажи */}
                                <Box>
                                    <Text fontSize="11px" fontWeight="800" color="gray.600" textTransform="uppercase" mb={3} px={1}>Последние продажи</Text>

                                    {/* Переключатель фильтров */}
                                    <HStack bg="whiteAlpha.50" p="4px" borderRadius="14px" mb={3} spacing={1} overflowX="auto" className="hide-scrollbar">
                                        {[
                                            { id: "model", label: "Модель" },
                                            { id: "backdrop", label: "Фон" },
                                            { id: "pattern", label: "Паттерн" },
                                            { id: "model_backdrop", label: "Модель + Фон" }
                                        ].map((btn) => (
                                            <Box
                                                key={btn.id}
                                                as="button"
                                                flexShrink={0}
                                                px={3}
                                                py="6px"
                                                borderRadius="10px"
                                                fontSize="11px"
                                                fontWeight="800"
                                                bg={activeFilter === btn.id ? "brand.500" : "transparent"}
                                                color={activeFilter === btn.id ? "gray.900" : "gray.400"}
                                                transition="all 0.2s"
                                                onClick={() => setActiveFilter(btn.id)}
                                            >
                                                {btn.label}
                                            </Box>
                                        ))}
                                    </HStack>

                                    <Box bg="whiteAlpha.50" borderRadius="20px" px={4} minH="100px">
                                        {filteredSales.length > 0 ? (
                                            filteredSales.map((sale) => <SaleRow key={sale.id} sale={sale} />)
                                        ) : (
                                            <Center py={8}><Text fontSize="12px" color="gray.500">Нет данных о продажах</Text></Center>
                                        )}
                                    </Box>
                                </Box>

                                <Button
                                    w="100%" h="54px" bg="brand.500" color="gray.900" borderRadius="18px"
                                    fontWeight="900" fontSize="16px" onClick={handleOpenFragment} mt={2}
                                >
                                    Открыть на Fragment
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