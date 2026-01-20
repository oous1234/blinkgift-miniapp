import React from "react"
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
  Divider,
  Button,
  Flex,
  Spinner,
  Center,
  Avatar,
  Icon,
} from "@chakra-ui/react"
import { GiftItem, GiftAttribute, MarketStat } from "../../types/inventory"

interface GiftDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  gift: GiftItem | null
  isLoading: boolean
  isError: boolean
}

// 1. Компонент для отображения ключевых метрик цены (P/L)
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
        {isTon && (
          <Text color="brand.500" fontWeight="900" fontSize="14px">
            💎
          </Text>
        )}
        <Text
          fontWeight="800"
          fontSize="15px"
          color={percent?.startsWith("+") ? "green.300" : "white"}
        >
          {value}
        </Text>
      </HStack>
      {percent && (
        <Badge
          variant="subtle"
          colorScheme={percent.startsWith("+") ? "green" : "red"}
          fontSize="11px"
          borderRadius="6px"
        >
          {percent}
        </Badge>
      )}
    </HStack>
  </Flex>
)

// 2. Строка атрибута рядом с картинкой
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

// 3. Строка таблицы рынка
const MarketTableRow = ({ stat, currency }: { stat: MarketStat; currency: string }) => (
  <Flex
    justify="space-between"
    align="center"
    py="10px"
    borderBottom="1px solid"
    borderColor="whiteAlpha.50"
  >
    <Text fontSize="13px" fontWeight="600" color="gray.300" flex={1}>
      {stat.label}
    </Text>
    <Text fontSize="13px" fontWeight="700" color="white" w="60px" textAlign="center">
      {stat.items_count}
    </Text>
    <HStack w="80px" justify="flex-end" spacing={1}>
      {stat.floor_price && (
        <Text color="brand.500" fontSize="12px">
          💎
        </Text>
      )}
      <Text fontSize="13px" fontWeight="800" color={stat.floor_price ? "white" : "gray.600"}>
        {stat.floor_price ? stat.floor_price : "N/A"}
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
  const handleOpenFragment = () => {
    if (!gift) return
    window.Telegram?.WebApp?.openLink(`https://fragment.com/gift/${gift.id}`)
  }

  // Заглушка для профита (так как в JSON пока нет цены покупки, выводим из расчетных данных или мокаем)
  // В будущем сюда можно прокинуть реальный purchasePrice
  const mockPL = { ton: "6.55", tonPercent: "+62.42%", usd: "$10.62", usdPercent: "+67.34%" }

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} scrollBehavior="inside">
      <DrawerOverlay backdropFilter="blur(15px)" bg="blackAlpha.800" />
      <DrawerContent borderTopRadius="32px" bg="#161920" color="white" maxH="95vh">
        <Box w="36px" h="4px" bg="whiteAlpha.400" borderRadius="full" mx="auto" mt={3} mb={1} />
        <DrawerCloseButton color="whiteAlpha.500" />

        <DrawerBody px={5} pt={2} pb={8}>
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
                {/* HEADER: Title & Basic Info */}
                <Box mt={2}>
                  <Text fontSize="22px" fontWeight="900" lineHeight="1.2">
                    {gift.name}
                  </Text>
                  <HStack color="gray.500" fontSize="13px" mt={1} spacing={2}>
                    <Text fontWeight="700">#{gift.num}</Text>
                    <Text>•</Text>
                    <HStack spacing={3}>
                      <Text cursor="pointer" _active={{ opacity: 0.5 }}>
                        📤
                      </Text>
                      <Text cursor="pointer" _active={{ opacity: 0.5 }}>
                        📋
                      </Text>
                      <Text cursor="pointer" _active={{ opacity: 0.5 }}>
                        ⭐
                      </Text>
                    </HStack>
                  </HStack>
                </Box>

                {/* SECTION 1: PRICE & P/L */}
                <VStack align="stretch" spacing={1} bg="whiteAlpha.50" p={4} borderRadius="20px">
                  <PriceStat label="Примерная цена" value={`${gift.estimatedPrice}`} isTon />
                  <PriceStat
                    label="P/L (TON)"
                    value={mockPL.ton}
                    percent={mockPL.tonPercent}
                    isTon
                  />
                  <PriceStat label="P/L ($)" value={mockPL.usd} percent={mockPL.usdPercent} />
                </VStack>

                {/* SECTION 2: VISUAL & TRAITS */}
                <HStack spacing={4} align="center">
                  <Box
                    boxSize="100px"
                    borderRadius="20px"
                    overflow="hidden"
                    bg="whiteAlpha.100"
                    flexShrink={0}
                  >
                    <Image src={gift.image} w="100%" h="100%" objectFit="cover" />
                  </Box>
                  <VStack flex={1} spacing={2}>
                    {gift.attributes?.map((attr, i) => (
                      <AttributeRow key={i} attr={attr} />
                    ))}
                  </VStack>
                </HStack>

                {/* SECTION 3: OWNER INFO */}
                <Flex align="center" justify="space-between">
                  <Text fontSize="15px" fontWeight="800">
                    Владелец
                  </Text>
                  <HStack
                    bg="whiteAlpha.50"
                    px={3}
                    py={1.5}
                    borderRadius="full"
                    spacing={2}
                    cursor="pointer"
                  >
                    <Avatar size="xs" name={gift.ownerUsername} bg="brand.500" />
                    <Text fontSize="13px" fontWeight="700" color="brand.500">
                      {gift.ownerUsername || "@hidden"}
                    </Text>
                  </HStack>
                </Flex>

                {/* SECTION 4: MARKET DEPTH TABLE */}
                <Box mt={2}>
                  <Flex justify="space-between" mb={2} px={1}>
                    <Text
                      fontSize="11px"
                      fontWeight="800"
                      color="gray.600"
                      textTransform="uppercase"
                    >
                      Параметр
                    </Text>
                    <Text
                      fontSize="11px"
                      fontWeight="800"
                      color="gray.600"
                      textTransform="uppercase"
                      w="60px"
                      textAlign="center"
                    >
                      Предметы
                    </Text>
                    <Text
                      fontSize="11px"
                      fontWeight="800"
                      color="gray.600"
                      textTransform="uppercase"
                      w="80px"
                      textAlign="right"
                    >
                      Цена
                    </Text>
                  </Flex>
                  <Box bg="whiteAlpha.50" borderRadius="20px" px={4}>
                    {gift.marketStats?.map((stat, i) => (
                      <MarketTableRow key={i} stat={stat} currency={gift.currency} />
                    ))}
                  </Box>
                </Box>

                <Button
                  w="100%"
                  h="54px"
                  bg="brand.500"
                  color="gray.900"
                  borderRadius="18px"
                  fontWeight="900"
                  fontSize="16px"
                  onClick={handleOpenFragment}
                  mt={2}
                  boxShadow="0 8px 20px rgba(232, 215, 253, 0.2)"
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
