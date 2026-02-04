import React from "react"
import { Box, Flex, Text, Image, HStack, Badge, VStack, Divider } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { TonIconBlue } from "../../../components/Shared/Icons"

const MotionBox = motion(Box)

interface FeedCardProps {
  item: any
  onClick: () => void
}

export const FeedCard: React.FC<FeedCardProps> = ({ item, onClick }) => {
  const dealScore = item.dealScore || 0
  const isGreatDeal = dealScore > 10

  return (
    <MotionBox
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      bg="rgba(255, 255, 255, 0.03)"
      borderRadius="20px"
      p="12px"
      mb="10px"
      border="1px solid"
      borderColor={isGreatDeal ? "brand.500" : "whiteAlpha.100"}
      position="relative"
      overflow="hidden"
    >
      {isGreatDeal && (
        <Box
          position="absolute" top="0" left="0" w="4px" h="100%" bg="brand.500"
          boxShadow="0 0 15px rgba(232, 215, 253, 0.6)"
        />
      )}

      <Flex gap={3} align="center">
        <Box position="relative">
          <Image
            src={item.imageUrl}
            boxSize="64px"
            borderRadius="14px"
            objectFit="cover"
            bg="blackAlpha.400"
          />
        </Box>

        <VStack align="start" spacing={0} flex={1}>
          <HStack justify="space-between" w="100%">
            <HStack spacing={1}>
              <Badge variant="subtle" colorScheme="purple" fontSize="9px" borderRadius="4px">
                {item.marketplace?.toUpperCase() || "FRAGMENT"}
              </Badge>
              <Text fontSize="10px" color="whiteAlpha.400" fontWeight="bold">
                {new Date(item.receivedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </Text>
            </HStack>
            {item.floor && (
               <Text fontSize="10px" color="whiteAlpha.500" fontWeight="800">
                 FLOOR: {item.floor}
               </Text>
            )}
          </HStack>

          <Text fontSize="15px" fontWeight="900" color="white" noOfLines={1} mt={0.5}>
            {item.name.split('#')[0]}
            <Text as="span" color="brand.500" ml={1}>#{item.name.split('#')[1]}</Text>
          </Text>

          <Flex justify="space-between" w="100%" align="flex-end" mt={1}>
            <HStack spacing={4}>
              <VStack align="start" spacing={-1}>
                <Text fontSize="8px" fontWeight="900" color="whiteAlpha.400">ЦЕНА</Text>
                <HStack spacing={1}>
                  <Text fontWeight="900" fontSize="16px">{item.price}</Text>
                  <TonIconBlue boxSize="12px" />
                </HStack>
              </VStack>

              {dealScore > 0 && (
                <VStack align="start" spacing={-1}>
                  <Text fontSize="8px" fontWeight="900" color="whiteAlpha.400">ВЫГОДА</Text>
                  <Text fontWeight="900" fontSize="16px" color="#4CD964">
                    +{dealScore}%
                  </Text>
                </VStack>
              )}
            </HStack>

            <Badge bg="whiteAlpha.100" color="whiteAlpha.700" fontSize="9px" px={2} borderRadius="6px">
              {item.model || "Standard"}
            </Badge>
          </Flex>
        </VStack>
      </Flex>
    </MotionBox>
  )
}