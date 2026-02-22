import React, { useState, useMemo } from "react";
import {
  Box, VStack, HStack, Text, Image, Badge,
  Flex, Divider, Center,
} from "@chakra-ui/react";
import { Gift } from "../../../types/domain";
import { TonValue } from "../../Shared/Typography";

interface Props {
  gift: Gift;
}

type TradeCategory = "model" | "backdrop" | "symbol" | "collection";

export const GiftDetailContent: React.FC<Props> = ({ gift }) => {
  const [activeTab, setActiveTab] = useState<TradeCategory>("model");

  const tabLabels: Record<TradeCategory, string> = {
    "model": "Модель",
    "backdrop": "Фон",
    "symbol": "Узор",
    "collection": "Коллекция"
  };

  const currentTrades = useMemo(() => {
    if (!gift || !gift.stats) return [];
    const targetLabel = tabLabels[activeTab];
    const stat = gift.stats.find(s => s.label === targetLabel);
    return stat?.lastTrades || [];
  }, [gift, activeTab]);

  if (!gift) return null;

  return (
    <VStack spacing={4} align="stretch" color="white" pt={2}>
      {/* Header */}
      <Box px={1}>
        <HStack justify="space-between" mb={1} align="center">
          <Text fontSize="24px" fontWeight="900" letterSpacing="-0.5px">
            {gift.name}
          </Text>
          <Badge bg="brand.500" color="black" borderRadius="6px" px={2} py={0.5} fontSize="11px" fontWeight="800">
            В НАЛИЧИИ
          </Badge>
        </HStack>
        <Text fontSize="14px" fontWeight="700" color="whiteAlpha.400">
          #{gift.number}
        </Text>
      </Box>

      {/* Pricing */}
      <VStack spacing={2} align="stretch" px={1} py={2}>
        <Flex justify="space-between" align="center">
          <Text color="whiteAlpha.500" fontSize="13px" fontWeight="600">Оценка стоимости</Text>
          <TonValue value={gift.estimatedPrice?.toFixed(2) || "0.00"} size="sm" />
        </Flex>
        <Flex justify="space-between" align="center">
          <Text color="whiteAlpha.500" fontSize="13px" fontWeight="600">Floor Price</Text>
          <TonValue value={gift.floorPrice?.toFixed(2) || "0.00"} size="sm" />
        </Flex>
      </VStack>

      {/* Attributes & Image */}
      <HStack spacing={4} align="center" py={2}>
        <Box boxSize="100px" borderRadius="14px" overflow="hidden" flexShrink={0} border="1px solid" borderColor="whiteAlpha.100" bg="black">
          <Image src={gift.image} w="100%" h="100%" objectFit="cover" />
        </Box>
        <VStack flex={1} spacing={1.5} align="stretch">
          {(gift.attributes || []).map((attr, i) => (
            <Flex key={i} justify="space-between" align="center">
              <Text fontSize="13px" color="whiteAlpha.500" fontWeight="600">{attr.label}</Text>
              <HStack spacing={2}>
                <Text fontSize="13px" fontWeight="800">{attr.value || "—"}</Text>
                <Text fontSize="11px" fontWeight="900" color="whiteAlpha.400" bg="whiteAlpha.100" px={1} borderRadius="3px">
                  {attr.rarity ?? 0}%
                </Text>
              </HStack>
            </Flex>
          ))}
        </VStack>
      </HStack>

      <Divider borderColor="whiteAlpha.100" />

      {/* Market Stats */}
      <Box>
        <HStack justify="space-between" mb={2} px={1}>
          <Text fontSize="11px" fontWeight="900" color="whiteAlpha.300">ПАРАМЕТР</Text>
          <Text fontSize="11px" fontWeight="900" color="whiteAlpha.300" textAlign="center">В ПРОДАЖЕ</Text>
          <Text fontSize="11px" fontWeight="900" color="whiteAlpha.300" textAlign="right">FLOOR</Text>
        </HStack>
        <VStack spacing={0} align="stretch">
          {(gift.stats || []).map((stat, i) => (
            <Box key={i} py={2.5} borderBottom="1px solid" borderColor="whiteAlpha.50">
              <Flex justify="space-between" align="center">
                <Text fontSize="13px" fontWeight="800" color="whiteAlpha.700" flex={1}>{stat.label}</Text>
                <Text fontSize="13px" fontWeight="800" color="whiteAlpha.800" textAlign="center" flex={1}>
                  {stat.count?.toLocaleString() || 0}
                </Text>
                <Box flex={1} textAlign="right">
                  <TonValue value={stat.floor ? stat.floor.toFixed(1) : '—'} size="sm" />
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Last Trades */}
      <Box mt={4}>
        <Text fontSize="18px" fontWeight="900" mb={3} color="white">Последние продажи</Text>
        <HStack spacing={1} mb={4} bg="whiteAlpha.50" p="2px" borderRadius="8px">
          {(["model", "backdrop", "symbol", "collection"] as TradeCategory[]).map((cat) => (
            <Box
              key={cat}
              as="button"
              flex={1}
              py={1.5}
              fontSize="10px"
              fontWeight="900"
              borderRadius="6px"
              bg={activeTab === cat ? "whiteAlpha.200" : "transparent"}
              color={activeTab === cat ? "brand.500" : "whiteAlpha.400"}
              onClick={() => setActiveTab(cat)}
              textTransform="uppercase"
            >
              {tabLabels[cat]}
            </Box>
          ))}
        </HStack>

        <VStack spacing={0} align="stretch" pb={10}>
          {currentTrades.length > 0 ? (
            currentTrades.map((trade, i) => {
              // Добавлена защита от пустых значений giftSlug
              const slugStr = trade.giftSlug || "";
              const avatarSlug = slugStr.split("-")[0]?.toLowerCase() || "unknown";
              const num = slugStr.split("-")[1] || "???";

              return (
                <Box key={i} py={2.5} borderBottom="1px solid" borderColor="whiteAlpha.50">
                  <Flex justify="space-between" align="center">
                    <HStack flex={1} spacing={2}>
                      <Box boxSize="28px" borderRadius="6px" overflow="hidden" bg="black" flexShrink={0}>
                        <Image
                          src={`https://nft.fragment.com/gift/${avatarSlug}.webp`}
                          fallback={<Box boxSize="28px" bg="whiteAlpha.100" />}
                        />
                      </Box>
                      <Text fontSize="12px" fontWeight="800">
                        #{num}
                      </Text>
                    </HStack>
                    <Text flex={1} fontSize="11px" fontWeight="700" color="whiteAlpha.400" textAlign="center">
                      {trade.date ? new Date(trade.date).toLocaleDateString([], { day: '2-digit', month: '2-digit' }) : "—"}
                    </Text>
                    <Box flex={1} textAlign="right">
                      <TonValue value={trade.giftTonPrice ? trade.giftTonPrice.toFixed(1) : "0"} size="sm" />
                    </Box>
                  </Flex>
                </Box>
              )
            })
          ) : (
            <Center py={8}>
              <Text fontSize="12px" color="whiteAlpha.300">Нет данных о продажах</Text>
            </Center>
          )}
        </VStack>
      </Box>
    </VStack>
  );
};