import React from "react"
import { Flex, Text, HStack } from "@chakra-ui/react"
import { GiftAttribute } from "../../types/domain"

export const AttributeItem: React.FC<{ attr: GiftAttribute }> = ({ attr }) => (
  <Flex
    justify="space-between"
    align="center"
    w="100%"
    bg="whiteAlpha.50"
    p={2.5}
    borderRadius="12px"
    border="1px solid"
    borderColor="whiteAlpha.50"
  >
    <Text color="gray.500" fontSize="10px" fontWeight="800" textTransform="uppercase">
      {attr.label}
    </Text>
    <HStack spacing={2}>
      <Text fontSize="11px" fontWeight="800" color="white">
        {attr.value}
      </Text>
      <Text color="brand.500" fontSize="10px" fontWeight="900">
        {attr.rarity}%
      </Text>
    </HStack>
  </Flex>
)