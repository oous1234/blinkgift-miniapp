// src/components/Market/MarketGiftCard.tsx
import React from "react"
import { Box, Text, AspectRatio, VStack, Flex, Image, Badge } from "@chakra-ui/react"
import { MarketplaceItem } from "../../types/marketplace"

export const MarketGiftCard: React.FC<{ item: MarketplaceItem }> = ({ item }) => {
  return (
    <Box
      position="relative"
      cursor="pointer"
      transition="all 0.2s"
      _active={{ transform: "scale(0.96)" }}
      role="group"
    >
      <AspectRatio ratio={1}>
        <Box
          borderRadius="24px"
          bg="#161920"
          border="1px solid"
          borderColor="whiteAlpha.100"
          overflow="hidden"
          position="relative"
          _groupHover={{ borderColor: "brand.500" }}
        >
          {/* Декоративное свечение на фоне */}
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
            transition="0.3s"
            _groupHover={{ transform: "scale(1.1)" }}
          />

          {/* Плашка с ценой */}
          <Flex
            position="absolute"
            bottom="0"
            left="50%"
            transform="translateX(-50%)"
            bg="brand.500" // Наш сиреневый
            px={4}
            py={1}
            borderTopRadius="12px"
            minW="80px"
            justify="center"
            boxShadow="0 -4px 10px rgba(0,0,0,0.3)"
          >
            <Text color="gray.900" fontWeight="900" fontSize="13px">
              {item.price} TON
            </Text>
          </Flex>
        </Box>
      </AspectRatio>

      <VStack mt={3} spacing={0} align="center">
        <Text fontSize="14px" fontWeight="700" isTruncated w="100%" textAlign="center">
          {item.name}
        </Text>
        <Text
          fontSize="10px"
          color="gray.500"
          fontWeight="800"
          textTransform="uppercase"
          letterSpacing="0.5px"
        >
          {item.model}
        </Text>
      </VStack>
    </Box>
  )
}
