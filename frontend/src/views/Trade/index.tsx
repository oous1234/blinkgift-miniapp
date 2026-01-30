import React from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  SimpleGrid,
  Avatar,
  Center,
  Heading,
  Button,
} from "@chakra-ui/react"
import { TradeSlot } from "./components/TradeSlot"
import { TradeIcon } from "@components/Shared/Icons"
import BottomNavigation from "@components/navigation/BottomNavigation"

const TradeView: React.FC = () => {
  return (
    <Box minH="100vh" bg="#0F1115" px={4} pt={8} pb="120px">
      <VStack align="start" spacing={1} mb={10}>
        <Heading size="lg" fontWeight="700">
          P2P <Text as="span" color="brand.500">Exchange</Text>
        </Heading>
        <Text color="whiteAlpha.400" fontSize="12px" fontWeight="500" textTransform="uppercase">
          Система безопасного обмена активами
        </Text>
      </VStack>

      <Box position="relative">
        {/* Фоновый слой под блюром */}
        <VStack spacing={8} filter="blur(6px)" opacity={0.3} pointerEvents="none">
          <Box w="100%">
            <HStack mb={4} justify="space-between" px={1}>
              <HStack spacing={3}>
                <Avatar size="xs" bg="whiteAlpha.200" />
                <Text fontSize="12px" fontWeight="700">MY OFFER</Text>
              </HStack>
              <Text fontSize="10px" color="whiteAlpha.300">0 / 3</Text>
            </HStack>
            <SimpleGrid columns={3} spacing={3}>
              <TradeSlot image="https://nft.fragment.com/gift/plushpepe-1515.webp" />
              <TradeSlot />
              <TradeSlot />
            </SimpleGrid>
          </Box>

          <Center>
            <TradeIcon boxSize="24px" color="whiteAlpha.200" />
          </Center>

          <Box w="100%">
            <HStack mb={4} justify="space-between" px={1}>
              <HStack spacing={3}>
                <Avatar size="xs" bg="whiteAlpha.100" />
                <Text fontSize="12px" fontWeight="700">COUNTERPARTY</Text>
              </HStack>
              <Text fontSize="10px" color="whiteAlpha.300">0 / 3</Text>
            </HStack>
            <SimpleGrid columns={3} spacing={3}>
              <TradeSlot image="https://nft.fragment.com/gift/lootbag-11217.webp" />
              <TradeSlot />
              <TradeSlot />
            </SimpleGrid>
          </Box>

          <Button w="100%" h="52px" isDisabled borderRadius="12px">
            ОЖИДАНИЕ ПРЕДЛОЖЕНИЯ
          </Button>
        </VStack>

        {/* Информационный текст */}
        <Center
          position="absolute"
          inset={0}
          zIndex={10}
          flexDirection="column"
        >
          <VStack spacing={4} textAlign="center" maxW="300px">
            <Text
              fontWeight="700"
              fontSize="12px"
              color="brand.500"
              textTransform="uppercase"
              letterSpacing="1.5px"
            >
              В разработке
            </Text>

            <Heading size="md" fontWeight="700">
              Протокол безопасных сделок
            </Heading>

            <Text fontSize="14px" color="whiteAlpha.700" fontWeight="400" lineHeight="1.5">
              Проектируем децентрализованную систему депонирования активов для исключения мошенничества при обмене.
            </Text>

            <HStack spacing={2} pt={4}>
                <Box boxSize="6px" borderRadius="full" bg="brand.500" />
                <Text fontSize="10px" fontWeight="700" color="whiteAlpha.500">
                    STATUS: INTEGRATION PHASE
                </Text>
            </HStack>
          </VStack>
        </Center>
      </Box>

      <BottomNavigation onSearchOpen={() => {}} />
    </Box>
  )
}

export default TradeView