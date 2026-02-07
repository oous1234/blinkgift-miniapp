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

type TradeCategory = "model" | "backdrop" | "model+backdrop";

export const GiftDetailContent: React.FC<Props> = ({ gift }) => {
  const [activeTab, setActiveTab] = useState<TradeCategory>("model");

  const tabLabels: Record<TradeCategory, string> = {
    "model": "Модель",
    "backdrop": "Фон",
    "model+backdrop": "Модель + Фон"
  };

  // Безопасное получение сделок
  const currentTrades = useMemo(() => {
    if (!gift || !gift.stats) return [];

    const targetLabel = tabLabels[activeTab];
    const stat = gift.stats.find(s => s.label === targetLabel);

    return stat?.lastTrades || [];
  }, [gift, activeTab]);

  if (!gift) return null;

  return (
    <VStack spacing={4} align="stretch" color="white" pt={2}>
      {/* --- ЗАГОЛОВОК --- */}
      <Box px={1}>
        <HStack justify="space-between" mb={1} align="center">
          <Text fontSize="24px" fontWeight="900" letterSpacing="-0.5px">
            {gift.name}
          </Text>
          <Badge bg="green.100" color="green.800" borderRadius="6px" px={2} py={0.5} fontSize="11px" fontWeight="800">
            Продаётся
          </Badge>
        </HStack>
        <Text fontSize="14px" fontWeight="700" color="whiteAlpha.400">
          #{gift.number}
        </Text>
      </Box>

      {/* --- БЛОК ЦЕН --- */}
      <VStack spacing={2} align="stretch" px={1} py={2}>
        <Flex justify="space-between" align="center">
          <Text color="whiteAlpha.500" fontSize="13px" fontWeight="600">Примерная цена</Text>
          <TonValue value={gift.estimatedPrice?.toFixed(2) || "0.00"} size="sm" />
        </Flex>
        <Flex justify="space-between" align="center">
          <Text color="whiteAlpha.500" fontSize="13px" fontWeight="600">Цена на маркетплейсе</Text>
          <HStack spacing={1}>
            <TonValue value={gift.floorPrice?.toFixed(2) || "0.00"} size="sm" />
            <Box boxSize="10px" bg="blue.400" borderRadius="2px" />
          </HStack>
        </Flex>
        <Flex justify="space-between" align="center">
          <Text color="whiteAlpha.500" fontSize="13px" fontWeight="600">P/L (TON)</Text>
          <HStack spacing={2}>
            <TonValue value={`+${(gift.estimatedPrice - gift.floorPrice).toFixed(2)}`} size="sm" />
            <Badge bg="green.900" color="green.400" fontSize="10px" borderRadius="4px">
              +{((gift.estimatedPrice / (gift.floorPrice || 1) - 1) * 100).toFixed(1)}%
            </Badge>
          </HStack>
        </Flex>
      </VStack>

      {/* --- ПРЕВЬЮ И АТТРИБУТЫ --- */}
      <HStack spacing={4} align="center" py={2}>
        <Box boxSize="100px" borderRadius="14px" overflow="hidden" flexShrink={0} border="1px solid" borderColor="whiteAlpha.100" bg="black">
          <Image src={gift.image} w="100%" h="100%" objectFit="cover" />
        </Box>
        <VStack flex={1} spacing={1.5} align="stretch">
          {(gift.attributes || []).map((attr, i) => (
            <Flex key={i} justify="space-between" align="center">
              <Text fontSize="13px" color="whiteAlpha.500" fontWeight="600">{attr.label}</Text>
              <HStack spacing={2}>
                <Text fontSize="13px" fontWeight="800">{attr.value}</Text>
                <Text fontSize="11px" fontWeight="900" color="whiteAlpha.400" bg="whiteAlpha.100" px={1} borderRadius="3px">
                  {attr.rarity}%
                </Text>
              </HStack>
            </Flex>
          ))}
        </VStack>
      </HStack>

      <Divider borderColor="whiteAlpha.100" />

      {/* --- ТАБЛИЦА ПАРАМЕТРОВ --- */}
      <Box>
        <HStack justify="space-between" mb={2} px={1}>
          <Text fontSize="11px" fontWeight="900" color="whiteAlpha.300">ПАРАМЕТР</Text>
          <Text fontSize="11px" fontWeight="900" color="whiteAlpha.300">КОЛИЧЕСТВО</Text>
          <Text fontSize="11px" fontWeight="900" color="whiteAlpha.300">ЦЕНА</Text>
        </HStack>
        <VStack spacing={0} align="stretch">
          {(gift.stats || []).map((stat, i) => (
            <Box key={i} py={2.5} borderBottom="1px solid" borderColor="whiteAlpha.50">
              <Flex justify="space-between" align="center">
                <Text fontSize="13px" fontWeight="800" color="whiteAlpha.700" flex={1}>{stat.label}</Text>
                <Text fontSize="13px" fontWeight="800" textDecoration="underline" color="whiteAlpha.800" textAlign="center" flex={1}>
                  {stat.count?.toLocaleString() || 0}
                </Text>
                <Box flex={1} textAlign="right">
                  <TonValue value={stat.floor?.toFixed(1) || '—'} size="sm" />
                </Box>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* --- СРЕДНЯЯ ЦЕНА / ИСТОРИЯ СДЕЛОК --- */}
      <Box mt={4}>
        <Text fontSize="18px" fontWeight="900" mb={3} color="white">средняя цена за 30 дней</Text>

        <HStack spacing={1} mb={4} bg="whiteAlpha.50" p="2px" borderRadius="8px">
          {(["model", "backdrop", "model+backdrop"] as TradeCategory[]).map((cat) => (
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

        <HStack justify="space-between" mb={2} px={1}>
          <Text fontSize="11px" fontWeight="900" color="whiteAlpha.300">ПРЕДМЕТ</Text>
          <Text fontSize="11px" fontWeight="900" color="whiteAlpha.300" textAlign="center">ДАТА</Text>
          <Text fontSize="11px" fontWeight="900" color="whiteAlpha.300" textAlign="right">ЦЕНА</Text>
        </HStack>

        <VStack spacing={0} align="stretch" pb={10}>
          {currentTrades.length > 0 ? (
            currentTrades.map((trade, i) => {
              const [name, num] = trade.giftSlug.split("-");
              const avatarSlug = name.toLowerCase();
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
                      <Text fontSize="12px" fontWeight="800" isTruncated>
                        #{num || "???"}
                      </Text>
                    </HStack>

                    <Text flex={1} fontSize="11px" fontWeight="700" color="whiteAlpha.400" textAlign="center">
                      {new Date(trade.date).toLocaleDateString([], { day: '2-digit', month: '2-digit' })}
                    </Text>

                    <Box flex={1} textAlign="right">
                      <TonValue value={trade.giftTonPrice?.toFixed(1) || "0"} size="sm" />
                    </Box>
                  </Flex>
                </Box>
              )
            })
          ) : (
            <Center py={8}>
              <Text fontSize="12px" color="whiteAlpha.300">Нет сделок по этому фильтру</Text>
            </Center>
          )}
        </VStack>
      </Box>
    </VStack>
  );
};