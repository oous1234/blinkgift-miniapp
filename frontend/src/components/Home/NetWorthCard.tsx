import React from "react"
import { Box, Flex, Text, VStack, Badge } from "@chakra-ui/react"

interface NetWorthCardProps {
  totalValue: number
  totalPnL: number
  pnlPercent: number
}

export const NetWorthCard: React.FC<NetWorthCardProps> = ({ totalValue, pnlPercent }) => {
  return (
    <Box py="48px" textAlign="center" position="relative">
      {/* Очень деликатное фиолетовое свечение на фоне, чтобы не было "плоско" */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="200px"
        h="120px"
        bg="purple.600"
        filter="blur(100px)"
        opacity="0.15"
        pointerEvents="none"
      />

      <VStack spacing={0}>
        <Text
          fontSize="12px"
          fontWeight="700"
          color="gray.500"
          letterSpacing="2px"
          textTransform="uppercase"
          mb="8px"
        >
          Estimated Balance
        </Text>

        <Flex align="baseline" justify="center" gap="12px">
          <Text fontSize="44px" fontWeight="800" color="white" letterSpacing="-1px" lineHeight="1">
            {totalValue.toLocaleString("ru-RU")}
          </Text>
          <Text
            fontSize="22px"
            fontWeight="700"
            color="purple.500" // Тот самый фиолетовый акцент
          >
            TON
          </Text>
        </Flex>

        <Flex align="center" gap="10px" mt="12px">
          <Text fontSize="16px" color="gray.400" fontWeight="500">
            ≈ $42 384 529,044
          </Text>
          <Badge
            bg="rgba(124, 58, 237, 0.15)" // Фиолетовый фон для профита
            color="purple.300"
            px="8px"
            py="2px"
            borderRadius="6px"
            fontSize="13px"
            fontWeight="700"
          >
            +{pnlPercent.toFixed(2)}%
          </Badge>
        </Flex>
      </VStack>
    </Box>
  )
}
