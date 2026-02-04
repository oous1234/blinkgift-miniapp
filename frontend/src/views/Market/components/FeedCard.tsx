import React from "react"
import { Box, Flex, Text, Image, HStack, Badge, VStack } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { TonIconBlue } from "../../../components/Shared/Icons"

const MotionBox = motion(Box)

interface FeedCardProps {
  item: any
  dealScore?: number
  onClick: () => void
}

export const FeedCard: React.FC<FeedCardProps> = ({ item, dealScore = 0, onClick }) => {

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      bg="whiteAlpha.50"
      borderRadius="24px"
      p="12px"
      mb="12px"
      border="1px solid"
      borderColor="whiteAlpha.100"
      onClick={onClick}
    >
      <Flex gap={4} align="center">
        <Box position="relative" flexShrink={0}>
          <Image
            src={item.imageUrl}
            boxSize="70px"
            borderRadius="18px"
            objectFit="cover"
          />
          <Badge
            position="absolute"
            top="-5px"
            right="-5px"
            bg="brand.500"
            color="black"
            fontSize="10px"
            px={1.5}
          >
            NEW
          </Badge>
        </Box>

        <VStack align="start" spacing={0} flex={1}>
          <HStack justify="space-between" w="100%">
            <Text fontSize="10px" fontWeight="900" color="brand.500">LISTING</Text>
            <Text fontSize="10px" color="whiteAlpha.300">LIVE</Text>
          </HStack>

          <Text fontSize="16px" fontWeight="800" color="white" noOfLines={1}>
            {item.name}
          </Text>

          <HStack spacing={4} mt={1}>
            <VStack align="start" spacing={0}>
              <Text fontSize="9px" fontWeight="800" color="whiteAlpha.400">ЦЕНА</Text>
              <HStack spacing={1}>
                <Text fontWeight="900" fontSize="14px">{item.price}</Text>
                <TonIconBlue boxSize="12px" />
              </HStack>
            </VStack>
            <VStack align="start" spacing={0}>
              <Text fontSize="9px" fontWeight="800" color="whiteAlpha.400">ПРОФИТ</Text>
              <Text fontWeight="900" fontSize="14px" color={dealScore > 0 ? "#4CD964" : "whiteAlpha.600"}>
                {dealScore > 0 ? `+${dealScore}%` : "0%"}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </Flex>
    </MotionBox>
  )
}