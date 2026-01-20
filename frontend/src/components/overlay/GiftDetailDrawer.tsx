// frontend/src/components/overlay/GiftDetailDrawer.tsx
import React from "react"
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  Button,
  Flex,
  Spinner,
  Center,
} from "@chakra-ui/react"
import { GiftItem } from "../../types/inventory"

interface GiftDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  gift: GiftItem | null
  isLoading: boolean
  isError: boolean
}

const InfoRow = ({
  label,
  value,
  valueColor = "white",
}: {
  label: string
  value: string
  valueColor?: string
}) => (
  <HStack justify="space-between" w="100%">
    <Text color="gray.500" fontSize="12px" fontWeight="700" textTransform="uppercase">
      {label}
    </Text>
    <Text color={valueColor} fontSize="14px" fontWeight="700">
      {value}
    </Text>
  </HStack>
)

const GiftDetailDrawer: React.FC<GiftDetailDrawerProps> = ({
  isOpen,
  onClose,
  gift,
  isLoading,
  isError,
}) => {
  const handleOpenFragment = () => {
    if (!gift) return
    const slug = gift.name.toLowerCase().replace(/\s+/g, "")
    const url = `https://fragment.com/gift/${slug}-${gift.num}`
    window.Telegram?.WebApp?.openLink(url)
  }

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      {/*
          Добавляем текст в DrawerOverlay.
          pointerEvents="none" нужен, чтобы клик по надписи
          все равно закрывал окно (пропускал клик к оверлею).
      */}
      <DrawerOverlay backdropFilter="blur(10px)" bg="blackAlpha.700">
        <Flex
          justify="center"
          align="start"
          pt="12vh" // Отступ сверху, чтобы надпись была в пустом пространстве
          w="100%"
          pointerEvents="none"
        >
          <Text
            fontSize="42px"
            fontWeight="900"
            color="whiteAlpha.200" // Полупрозрачный белый
            letterSpacing="4px"
            userSelect="none" // Чтобы текст нельзя было выделить
          >
            IN'SNAP
          </Text>
        </Flex>
      </DrawerOverlay>

      <DrawerContent borderTopRadius="32px" bg="#161920" color="white" p={2} minH="480px">
        <Box w="40px" h="4px" bg="whiteAlpha.300" borderRadius="full" mx="auto" mt={3} mb={2} />
        <DrawerCloseButton />

        <DrawerBody px={6} pt={4} pb={10}>
          {/* СОСТОЯНИЕ 1: ЗАГРУЗКА */}
          {isLoading && (
            <Center h="380px">
              <VStack spacing={4}>
                <Spinner size="xl" color="brand.500" thickness="4px" />
                <Text color="gray.400" fontWeight="600">
                  Спрашиваем у блокчейна...
                </Text>
              </VStack>
            </Center>
          )}

          {/* СОСТОЯНИЕ 2: ОШИБКА */}
          {!isLoading && isError && (
            <Center h="400px">
              <VStack spacing={6} textAlign="center">
                <Box borderRadius="24px" overflow="hidden" boxShadow="0 10px 30px rgba(0,0,0,0.5)">
                  <Image
                    src="/502.gif"
                    alt="Error occurred"
                    w="200px"
                    h="200px"
                    objectFit="cover"
                  />
                </Box>

                <VStack spacing={2}>
                  <Text fontSize="18px" fontWeight="800" color="brand.500">
                    Ошибка получения данных
                  </Text>
                  <Text fontSize="14px" color="gray.400" px={4} fontWeight="500" lineHeight="1.5">
                    Информация о подарке как бы есть, но мы её как бы не можем вывести. Попробуйте
                    снова чуть позже.
                  </Text>
                </VStack>

                <Button
                  size="md"
                  bg="whiteAlpha.200"
                  _active={{ bg: "whiteAlpha.300" }}
                  color="white"
                  borderRadius="14px"
                  onClick={() => window.location.reload()}
                >
                  Перезагрузить
                </Button>
              </VStack>
            </Center>
          )}

          {/* СОСТОЯНИЕ 3: УСПЕХ */}
          {!isLoading && !isError && gift && (
            <VStack spacing={6}>
              <Flex
                w="100%"
                justify="center"
                align="center"
                py={8}
                borderRadius="24px"
                bg="radial-gradient(circle, rgba(232, 215, 253, 0.1) 0%, transparent 70%)"
              >
                <Image
                  src={gift.image}
                  alt={gift.name}
                  w="180px"
                  h="180px"
                  filter="drop-shadow(0 10px 20px rgba(0,0,0,0.5))"
                />
              </Flex>

              <VStack align="start" w="100%" spacing={1}>
                <HStack justify="space-between" w="100%">
                  <Text fontSize="22px" fontWeight="800">
                    {gift.name}
                  </Text>
                  <Badge colorScheme="purple" borderRadius="lg" px={3}>
                    #{gift.num}
                  </Badge>
                </HStack>
                <Text color="gray.400" fontWeight="600">
                  {gift.collection}
                </Text>
              </VStack>

              <Divider borderColor="whiteAlpha.100" />

              <VStack w="100%" spacing={3}>
                <InfoRow label="Редкость" value={gift.rarity} valueColor="brand.500" />
                <InfoRow
                  label="Рыночная цена"
                  value={`${gift.floorPrice} ${gift.currency}`}
                  valueColor="brand.500"
                />
                <InfoRow label="Статус" value="В коллекции" />
              </VStack>

              <Button
                w="100%"
                h="56px"
                bg="brand.500"
                color="gray.900"
                borderRadius="18px"
                fontWeight="800"
                fontSize="16px"
                onClick={handleOpenFragment}
              >
                Открыть на Fragment
              </Button>
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default GiftDetailDrawer
