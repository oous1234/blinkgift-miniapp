import React from "react"
import { Box, Flex, Text, VStack, Badge } from "@chakra-ui/react"

interface NetWorthCardProps {
  totalValue: number
  pnlPercent: number
}

export const NetWorthCard: React.FC<NetWorthCardProps> = ({ totalValue, pnlPercent }) => {
  const formattedValue = totalValue.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const [integerPart, decimalPart] = formattedValue.split(",")

  return (
    <Box py="32px" textAlign="center" position="relative">
      <VStack spacing={0}>
        <Text fontSize="12px" fontWeight="500" color="gray.500" mb="8px" letterSpacing="0.3px">
          Общая стоимость портфеля
        </Text>

        <Flex align="baseline" justify="center" mb="12px">
          <Text fontSize="40px" fontWeight="700" color="white" letterSpacing="-1px">
            {integerPart}
          </Text>
          <Text fontSize="22px" fontWeight="700" color="white" opacity="0.9">
            ,{decimalPart}
          </Text>
          <Text fontSize="16px" fontWeight="600" color="#e8d7fd" ml="8px">
            TON
          </Text>
        </Flex>

        <Flex align="center" gap="10px">
          <Text fontSize="13px" color="gray.500" fontWeight="500">
            ≈ $42 384 529,04
          </Text>

          {/* Овальный бейдж с темным текстом */}
          <Badge
            bg="#e8d7fd"
            color="#0F1115"
            px="12px"
            py="3px"
            borderRadius="100px"
            fontSize="12px"
            fontWeight="800"
            textTransform="none"
            boxShadow="0 4px 10px rgba(232, 215, 253, 0.2)"
          >
            +{pnlPercent.toFixed(2)}%
          </Badge>
        </Flex>
      </VStack>
    </Box>
  )
}
