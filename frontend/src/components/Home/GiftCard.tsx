import React from "react"
import { Box, Flex, Text, Image, AspectRatio } from "@chakra-ui/react"
import { GiftItem } from "../data"

export const GiftCard: React.FC<{ item: GiftItem }> = ({ item }) => {
  const profit = item.floorPrice - item.purchasePrice

  return (
    <Box
      bg="#161920"
      borderRadius="18px"
      overflow="hidden"
      border="1px solid"
      borderColor="whiteAlpha.100"
      position="relative"
      transition="transform 0.1s"
      _active={{ transform: "scale(0.98)" }}
    >
      {/* Quantity Badge */}
      {item.quantity > 1 && (
        <Box
          position="absolute"
          top="10px"
          right="10px"
          zIndex={2}
          bg="#0098EA"
          fontSize="10px"
          fontWeight="bold"
          px="6px"
          py="2px"
          borderRadius="4px"
        >
          x{item.quantity}
        </Box>
      )}

      {/* Image Area */}
      <AspectRatio ratio={1}>
        <Box bgGradient="radial(circle at center, #262A35 0%, #1A1D26 100%)" p="10px">
          <Image
            src={item.image}
            alt={item.name}
            w="100%"
            h="100%"
            objectFit="cover"
            borderRadius="12px"
            fallback={<Text fontSize="42px">🎁</Text>}
          />
        </Box>
      </AspectRatio>

      {/* Info Area */}
      <Box p="12px 14px" bg="whiteAlpha.50">
        <Text fontSize="14px" fontWeight="700" isTruncated mb="6px">
          {item.name}
        </Text>
        <Flex justify="space-between" align="flex-end">
          <Flex direction="column">
            <Text fontSize="10px" color="gray.500" mb="1px">
              Floor
            </Text>
            <Text fontSize="14px" fontWeight="700">
              {item.floorPrice}{" "}
              <Text as="span" fontSize="10px" color="#0098EA">
                TON
              </Text>
            </Text>
          </Flex>

          {profit > 0 && (
            <Text
              fontSize="11px"
              color="green.400"
              bg="rgba(76,175,80,0.1)"
              px="4px"
              borderRadius="3px"
              fontWeight="600"
            >
              +{profit.toFixed(1)}
            </Text>
          )}
        </Flex>
      </Box>
    </Box>
  )
}
