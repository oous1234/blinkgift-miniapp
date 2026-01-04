import React from "react"
import { Box, Flex, Text, VStack, Badge, HStack } from "@chakra-ui/react"

interface NetWorthCardProps {
  totalValue: number // Количество TON
  pnlPercent: number // Процент доходности
  tonPrice?: number  // Курс TON к USD (по умолчанию зададим, если не передан)
}

export const NetWorthCard: React.FC<NetWorthCardProps> = ({
                                                            totalValue,
                                                            pnlPercent,
                                                            tonPrice = 5.2 // Примерный курс, лучше передавать актуальный из API
                                                          }) => {
  // Форматирование количества TON
  const formattedValue = totalValue.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const [integerPart, decimalPart] = formattedValue.split(",")

  // Расчет стоимости в долларах
  const usdValue = totalValue * tonPrice
  const formattedUsd = usdValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <Box
      py="40px"
      px="20px"
      textAlign="center"
      position="relative"
      // Можно добавить фон, если нужно выделить карточку:
      // bg="rgba(255, 255, 255, 0.03)"
      // borderRadius="24px"
    >
      <VStack spacing="16px">
        {/* Заголовок: Стоимость инвентаря */}
        <Text
          fontSize="14px"
          fontWeight="600"
          color="gray.400"
          letterSpacing="1.5px"
          textTransform="uppercase"
        >
          Стоимость инвентаря
        </Text>

        {/* Основная сумма в TON */}
        <Flex align="baseline" justify="center" lineHeight="1">
          <Text
            fontSize="64px"
            fontWeight="800"
            color="white"
            letterSpacing="-2px"
            // Тень для объема
            textShadow="0 10px 30px rgba(0,0,0,0.3)"
          >
            {integerPart}
            <Text as="span" fontSize="32px" color="gray.400" fontWeight="600">
              ,{decimalPart}
            </Text>
          </Text>

          <Text
            fontSize="24px"
            fontWeight="800"
            ml="12px"
            bgGradient="linear(to-r, #e8d7fd, #bca4ff)"
            bgClip="text"
            color="transparent" // Fallback если градиент не сработает
          >
            TON
          </Text>
        </Flex>

        {/* Нижний блок: Доллары и Проценты */}
        <HStack spacing="12px" bg="rgba(255,255,255,0.05)" py="8px" px="16px" borderRadius="16px">
          <Text fontSize="15px" color="gray.300" fontWeight="500">
            ≈ {formattedUsd}
          </Text>

          <Badge
            bg="#e8d7fd"
            color="#0F1115"
            px="8px"
            py="2px"
            borderRadius="6px"
            fontSize="11px"
            fontWeight="800"
            boxShadow="0 0 10px rgba(232, 215, 253, 0.4)"
          >
            +{pnlPercent.toFixed(2)}%
          </Badge>
        </HStack>
      </VStack>
    </Box>
  )
}