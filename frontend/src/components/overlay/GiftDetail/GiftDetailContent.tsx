import React from "react";
import {
  Box, VStack, HStack, Text, Image, Badge, Divider,
  Table, Tbody, Tr, Td, IconButton, Flex, SimpleGrid,
  Center, Spinner
} from "@chakra-ui/react";
import { Gift } from "../../../types/domain";
import { TonValue } from "../../Shared/Typography";
import {
  ExternalLinkIcon, CopyIcon, StarIcon, RepeatIcon
} from "@chakra-ui/icons";

interface Props {
  gift: Gift;
  history: any[];
  isHistoryLoading: boolean;
}

export const GiftDetailContent: React.FC<Props> = ({ gift }) => {
  // Расчет P/L для примера (в реальности данные должны приходить из API)
  const plTon = 1.88;
  const plPercent = 101.4;

  return (
    <VStack spacing={5} align="stretch" color="white">
      {/* HEADER: Title & Status */}
      <VStack align="stretch" spacing={1}>
        <HStack justify="space-between" align="center">
          <Text fontSize="24px" fontWeight="900" letterSpacing="-0.5px">
            {gift.name.split('#')[0]}
            <Badge ml={3} bg="green.400" color="black" borderRadius="6px" fontSize="10px" fontWeight="900" px={2} verticalAlign="middle">
              ПРОДАЁТСЯ
            </Badge>
          </Text>
        </HStack>

        <HStack spacing={2} color="whiteAlpha.400">
          <Text fontSize="14px" fontWeight="800">#{gift.number}</Text>
          <Text>•</Text>
          <HStack spacing={3}>
             <IconButton aria-label="share" icon={<ExternalLinkIcon />} size="xs" variant="ghost" color="whiteAlpha.600" />
             <IconButton aria-label="copy" icon={<CopyIcon />} size="xs" variant="ghost" color="whiteAlpha.600" />
             <IconButton aria-label="fav" icon={<StarIcon />} size="xs" variant="ghost" color="whiteAlpha.600" />
             <IconButton aria-label="refresh" icon={<RepeatIcon />} size="xs" variant="ghost" color="whiteAlpha.600" />
          </HStack>
          <Badge bg="whiteAlpha.100" color="white" fontSize="10px" px={2} borderRadius="6px">Больше</Badge>
        </HStack>
      </VStack>

      {/* PRICE SECTION */}
      <VStack align="stretch" spacing={2} bg="whiteAlpha.50" p={4} borderRadius="20px">
        <HStack justify="space-between">
          <Text color="whiteAlpha.500" fontSize="13px" fontWeight="700">Примерная цена</Text>
          <TonValue value={gift.estimatedPrice.toFixed(2)} size="sm" />
        </HStack>
        <HStack justify="space-between">
          <Text color="whiteAlpha.500" fontSize="13px" fontWeight="700">Цена на маркетплейсе</Text>
          <HStack spacing={1}>
            <TonValue value={gift.floorPrice.toFixed(2)} size="sm" />
            <Box boxSize="12px" bg="blue.400" borderRadius="3px" />
          </HStack>
        </HStack>
        <HStack justify="space-between">
          <Text color="whiteAlpha.500" fontSize="13px" fontWeight="700">P/L (TON)</Text>
          <HStack>
            <TonValue value={`+${plTon}`} size="sm" />
            <Badge bg="green.900" color="green.400" fontSize="10px">+{plPercent}%</Badge>
          </HStack>
        </HStack>
      </VStack>

      {/* ATTRIBUTES SECTION (Image + Traits) */}
      <HStack spacing={4} align="center" bg="whiteAlpha.50" p={3} borderRadius="20px">
        <Box boxSize="100px" borderRadius="18px" overflow="hidden" flexShrink={0}>
          <Image src={gift.image} w="100%" h="100%" objectFit="cover" />
        </Box>
        <VStack flex={1} spacing={1} align="stretch">
          {gift.attributes.map((attr, i) => (
            <HStack key={i} justify="space-between">
              <Text fontSize="13px" color="whiteAlpha.500" fontWeight="700">{attr.label}</Text>
              <HStack spacing={2}>
                <Text fontSize="13px" fontWeight="800">{attr.value}</Text>
                <Text fontSize="11px" fontWeight="900" color="whiteAlpha.400" bg="whiteAlpha.100" px={1} borderRadius="4px">
                  {attr.rarity}%
                </Text>
              </HStack>
            </HStack>
          ))}
        </VStack>
      </HStack>

      {/* TABLE 1: ПАРАМЕТРЫ */}
      <Box mt={2}>
        <HStack justify="space-between" mb={2} px={1}>
          <Text fontSize="11px" fontWeight="900" color="whiteAlpha.300">ПАРАМЕТР</Text>
          <Text fontSize="11px" fontWeight="900" color="whiteAlpha.300">КОЛИЧЕСТВО</Text>
          <Text fontSize="11px" fontWeight="900" color="whiteAlpha.300">ЦЕНА</Text>
        </HStack>
        <VStack spacing={0} align="stretch">
          {gift.stats.map((stat, i) => (
            <Box key={i} py={2} borderBottom="1px solid" borderColor="whiteAlpha.50">
              <Flex justify="space-between" align="center">
                <Text fontSize="13px" fontWeight="800" color="whiteAlpha.700">{stat.label}</Text>
                <Text fontSize="13px" fontWeight="800" textDecoration="underline" color="whiteAlpha.800">{stat.count}</Text>
                <TonValue value={stat.floor?.toFixed(1) || '—'} size="sm" />
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* TABLE 2: СРЕДНЯЯ ЦЕНА */}
      <Box mt={4}>
        <Text fontSize="18px" fontWeight="900" mb={3} letterSpacing="-0.5px">Средняя цена за 30 дней</Text>
        <HStack justify="space-between" mb={2} px={1}>
          <Text fontSize="11px" fontWeight="900" color="whiteAlpha.300">ПАРАМЕТР</Text>
          <Text fontSize="11px" fontWeight="900" color="whiteAlpha.300">СДЕЛКИ</Text>
          <Text fontSize="11px" fontWeight="900" color="whiteAlpha.300">ЦЕНА</Text>
        </HStack>
        <VStack spacing={0} align="stretch">
          {gift.attributes.slice(0, 2).map((attr, i) => (
            <Box key={i} py={2} borderBottom="1px solid" borderColor="whiteAlpha.50">
              <Flex justify="space-between" align="center">
                <Text fontSize="13px" fontWeight="800" color="whiteAlpha.700">{attr.label}</Text>
                <Text fontSize="13px" fontWeight="800" color="whiteAlpha.800">{50 + i * 12}</Text>
                <TonValue value={(gift.estimatedPrice - i * 0.2).toFixed(2)} size="sm" />
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
};