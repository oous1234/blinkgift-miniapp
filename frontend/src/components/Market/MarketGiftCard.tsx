// src/components/Market/MarketGiftCard.tsx
import React from "react"
import { Box, Text, AspectRatio, Flex } from "@chakra-ui/react"
import { MarketplaceItem } from "../../types/marketplace"
import { GiftRibbon } from "../Home/GiftRibbon"

export const MarketGiftCard: React.FC<{ item: MarketplaceItem }> = ({ item }) => {
  // Извлекаем номер из строки "Name #123"
  const extractNumber = (name: string) => {
    const match = name.match(/#(\d+)/)
    return match ? parseInt(match[1], 10) : 0
  }

  const giftNumber = extractNumber(item.name)
  const displayName = item.name.split("#")[0].trim()

  return (
    <Box
      position="relative"
      mb="20px" // Отступ снизу увеличен, чтобы "островок" не налезал на следующую карточку
      cursor="pointer"
      transition="all 0.2s"
      _active={{ transform: "scale(0.96)" }}
    >
      <AspectRatio ratio={1}>
        <Box
          borderRadius="20px"
          bg="#0F0F0F"
          border="1px solid"
          borderColor="whiteAlpha.100"
          overflow="hidden"
          position="relative"
          boxShadow="0 4px 15px rgba(0,0,0,0.3)"
        >
          {/* 1. Изображение во весь блок (как в инвентаре) */}
          <Box
            w="100%"
            h="100%"
            bgImage={`url(${item.imageUrl})`}
            bgSize="cover"
            bgPosition="center center"
            position="absolute"
            top="0"
            left="0"
          />

          {/* 2. Затемнение внизу, чтобы текст названия читался лучше */}
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            h="40%"
            bgGradient="linear(to-t, rgba(0,0,0,0.8), transparent)"
            pointerEvents="none"
          />

          {/* 3. Название подарка внутри карточки снизу */}
          <Box position="absolute" bottom="12px" left="0" right="0" textAlign="center" zIndex={2}>
            <Text
              fontSize="14px"
              fontWeight="700"
              color="rgb(235, 212, 200)" // Тот самый бежевый цвет из инвентаря
              textShadow="0px 2px 8px rgba(0,0,0,0.8)"
            >
              {displayName}
            </Text>
          </Box>

          {/* 4. Ленточка с номером справа сверху */}
          {giftNumber > 0 && (
            <GiftRibbon
              num={giftNumber}
              id={item.id}
              colors={{ from: "#1c2c3e", to: "#0d151f", text: "#98c1ff" }} // Синие тона ленты для маркета
            />
          )}
        </Box>
      </AspectRatio>

      {/* 5. СИНИЙ ОСТРОВОК ЦЕНЫ (идет вниз от карточки) */}
      <Flex
        position="absolute"
        top="92%" // Начинается почти у самого низа основной карточки
        left="50%"
        transform="translateX(-50%)"
        bg="#007AFF" // Яркий синий
        px={4}
        py={1}
        borderRadius="12px"
        minW="85px"
        justify="center"
        align="center"
        zIndex={10}
        boxShadow="0 4px 10px rgba(0, 122, 255, 0.4)"
        border="2px solid #0F1115" // Контур, чтобы отделить от других карточек
      >
        <Text color="white" fontWeight="900" fontSize="12px">
          {item.price} TON
        </Text>
      </Flex>
    </Box>
  )
}
