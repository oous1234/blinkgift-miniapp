import React from "react"
import { Box, Flex, Text, Image, HStack, Badge, VStack } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { TonIconBlue } from "@components/Shared/Icons"

const MotionBox = motion(Box)

interface FeedCardProps {
  item: any
  onClick: () => void
}

export const FeedCard: React.FC<FeedCardProps> = ({ item, onClick }) => {
  // Имитируем расчет оценки (в будущем будет приходить с бэка)
  const estPrice = item.price * 1.15
  const dealScore = 15 // % профита

  return (
    <MotionBox
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      bg="whiteAlpha.50"
      borderRadius="24px"
      p="12px"
      mb="12px"
      border="1px solid"
      borderColor="whiteAlpha.100"
      cursor="pointer"
      transition="background 0.2s"
      _active={{ bg: "whiteAlpha.100" }}
    >
      <Flex gap={4} align="center">
        {/* Аватар подарка */}
        <Box position="relative" flexShrink={0}>
          <Image
            src={item.imageUrl}
            boxSize="70px"
            borderRadius="18px"
            objectFit="cover"
            bg="blackAlpha.400"
            fallback={<Box boxSize="70px" borderRadius="18px" bg="whiteAlpha.100" />}
          />
          <Badge
            position="absolute"
            top="-5px"
            right="-5px"
            bg="brand.500"
            color="black"
            fontSize="10px"
            fontWeight="900"
            borderRadius="6px"
            px={1.5}
            boxShadow="0 2px 4px rgba(0,0,0,0.3)"
          >
            NEW
          </Badge>
        </Box>

        {/* Инфо часть */}
        <VStack align="start" spacing={0} flex={1} overflow="hidden">
          <HStack justify="space-between" w="100%">
            <Text fontSize="10px" fontWeight="900" color="brand.500" letterSpacing="0.8px">
              LISTING
            </Text>
            <Text fontSize="10px" color="whiteAlpha.300" fontWeight="700">
              ТОЛЬКО ЧТО
            </Text>
          </HStack>

          <Text fontSize="16px" fontWeight="800" color="white" noOfLines={1}>
            {item.name.split('#')[0]}
            <Text as="span" color="whiteAlpha.400" ml={1} fontSize="14px">
              #{item.name.split('#')[1]}
            </Text>
          </Text>

          <HStack spacing={4} mt={1}>
            <VStack align="start" spacing={0}>
              <Text fontSize="9px" fontWeight="800" color="whiteAlpha.400" textTransform="uppercase">Цена</Text>
              <HStack spacing={1}>
                <Text fontWeight="900" fontSize="14px">{item.price}</Text>
                <TonIconBlue boxSize="12px" />
              </HStack>
            </VStack>

            <VStack align="start" spacing={0}>
              <Text fontSize="9px" fontWeight="800" color="whiteAlpha.400" textTransform="uppercase">Оценка</Text>
              <Text fontWeight="900" fontSize="14px" color="whiteAlpha.600">
                ~{estPrice.toFixed(1)}
              </Text>
            </VStack>

            <VStack align="start" spacing={0}>
              <Text fontSize="9px" fontWeight="800" color="whiteAlpha.400" textTransform="uppercase">Профит</Text>
              <Text fontWeight="900" fontSize="14px" color="#4CD964">
                +{dealScore}%
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </Flex>
    </MotionBox>
  )
}