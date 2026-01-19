// src/components/overlay/GiftDetailDrawer.tsx
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
} from "@chakra-ui/react"
import { GiftItem } from "../../types/inventory"

interface GiftDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  gift: GiftItem | null
}

// Вспомогательный компонент для строк (чтобы не дублировать код)
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

const GiftDetailDrawer: React.FC<GiftDetailDrawerProps> = ({ isOpen, onClose, gift }) => {
  if (!gift) return null

  const handleOpenFragment = () => {
    const slug = gift.name.toLowerCase().replace(/\s+/g, "")
    const url = `https://fragment.com/gift/${slug}-${gift.num}`
    window.Telegram?.WebApp?.openLink(url)
  }

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay backdropFilter="blur(10px)" bg="blackAlpha.700" />
      <DrawerContent borderTopRadius="32px" bg="#161920" color="white" p={2}>
        <Box w="40px" h="4px" bg="whiteAlpha.300" borderRadius="full" mx="auto" mt={3} mb={2} />
        <DrawerCloseButton />

        <DrawerBody px={6} pt={4} pb={10}>
          <VStack spacing={6}>
            {/* Изображение с красивым свечением */}
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

            {/* Заголовок */}
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

            {/* Таблица инфо */}
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
              _active={{ transform: "scale(0.98)" }}
              onClick={handleOpenFragment}
            >
              Открыть на Fragment
            </Button>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default GiftDetailDrawer
