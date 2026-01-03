import React from "react"
import { Box, Flex, Text } from "@chakra-ui/react"

interface NetWorthCardProps {
  totalValue: number
  totalPnL: number
  pnlPercent: number
  bestPerformer: { name: string; profit: number }
}

export const NetWorthCard: React.FC<NetWorthCardProps> = ({
                                                            totalValue,
                                                            totalPnL,
                                                            pnlPercent,
                                                            bestPerformer,
                                                          }) => {
  const isPositive = totalPnL >= 0

  return (
    <Box
      bgGradient="linear(135deg, #161920 0%, #13161c 100%)"
      borderRadius="24px"
      p="24px"
      mb="24px"
      border="1px solid"
      borderColor="whiteAlpha.100"
      position="relative"
      overflow="hidden"
      boxShadow="lg"
    >
      {/* Glow Effect */}
      <Box
        position="absolute"
        top="-50%"
        right="-20%"
        w="200px"
        h="200px"
        bg="#0098EA"
        filter="blur(80px)"
        opacity={0.15}
        borderRadius="full"
        pointerEvents="none"
      />

      {/* Content */}
      <Box position="relative" zIndex={1}>
        <Flex justify="space-between" align="center" mb="12px">
          <Text fontSize="13px" color="gray.400" fontWeight="500">
            ESTIMATED BALANCE
          </Text>
          <Box
            bg={isPositive ? "green.900" : "red.900"} // Используем токены темы
            color={isPositive ? "green.400" : "red.400"}
            px="8px"
            py="2px"
            borderRadius="6px"
            fontSize="12px"
            fontWeight="bold"
          >
            {isPositive ? "+" : ""}
            {pnlPercent.toFixed(2)}%
          </Box>
        </Flex>

        <Flex align="baseline" gap="8px">
          <Text fontSize="42px" fontWeight="800" lineHeight="1.1" letterSpacing="-1px">
            {totalValue.toLocaleString()}
          </Text>
          <Text fontSize="24px" fontWeight="700" color="#0098EA">
            TON
          </Text>
        </Flex>

        <Text fontSize="14px" color="gray.500" mt="6px" fontWeight="500">
          ≈ ${(totalValue * 5.2).toLocaleString()} USD
        </Text>

        <Box h="1px" bgGradient="linear(to-r, transparent, whiteAlpha.100, transparent)" my="20px" />

        <Flex align="center" justify="space-between">
          <Text fontSize="13px" color="gray.400">
            Top Performer
          </Text>
          <Flex align="center" gap="6px">
            <Text fontSize="13px" fontWeight="600">
              {bestPerformer.name}
            </Text>
            <Text
              fontSize="12px"
              color="#0098EA"
              bg="rgba(0,152,234,0.1)"
              px="6px"
              borderRadius="4px"
            >
              +{bestPerformer.profit.toFixed(0)} TON
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}