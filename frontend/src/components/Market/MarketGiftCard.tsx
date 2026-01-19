// frontend/src/components/Market/MarketGiftCard.tsx
import React from "react"
import { Box, Text, AspectRatio, VStack, Flex, Image } from "@chakra-ui/react"
import { MarketplaceItem } from "../../types/marketplace"

interface MarketGiftCardProps {
  item: MarketplaceItem
}

export const MarketGiftCard: React.FC<MarketGiftCardProps> = ({ item }) => {
  return (
    <Box
      position="relative"
      cursor="pointer"
      transition="transform 0.2s"
      _active={{ transform: "scale(0.96)" }}
    >
      <AspectRatio ratio={1}>
        <Box
          borderRadius="24px"
          bg="#161920"
          border="1px solid"
          borderColor="whiteAlpha.100"
          overflow="hidden"
          position="relative"
        >
          {/* Фон-градиент на основе backdrop (опционально) */}
          <Box
            position="absolute"
            inset={0}
            bg="radial-gradient(circle at center, rgba(232, 215, 253, 0.05) 0%, transparent 70%)"
          />

          <Image
            src={item.imageUrl}
            alt={item.name}
            w="100%"
            h="100%"
            objectFit="contain"
            p={4}
            zIndex={1}
          />

          {/* "Чёлка" с ценой снизу */}
          <Flex
            position="absolute"
            bottom="0"
            left="50%"
            transform="translateX(-50%)"
            bg="#e8d7fd"
            px={4}
            py={1}
            borderTopRadius="12px"
            minW="80px"
            justify="center"
            align="center"
            zIndex={2}
            boxShadow="0 -4px 10px rgba(0,0,0,0.3)"
          >
            <Text color="#0F1115" fontWeight="900" fontSize="13px">
              {item.price} TON
            </Text>
          </Flex>
        </Box>
      </AspectRatio>

      <VStack mt={3} spacing={0} align="center">
        <Text fontSize="14px" fontWeight="700" isTruncated w="100%" textAlign="center">
          {item.name}
        </Text>
        <Text fontSize="11px" color="gray.500" fontWeight="600" textTransform="uppercase">
          {item.model}
        </Text>
      </VStack>
    </Box>
  )
}
