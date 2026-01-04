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

const GiftDetailDrawer: React.FC<GiftDetailDrawerProps> = ({ isOpen, onClose, gift }) => {
    if (!gift) return null

    // Определяем цвет редкости
    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case "Legendary": return "#FFD700"
            case "Rare": return "#AD82FF"
            default: return "#A0AEC0"
        }
    }

    return (
        <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} variant="alwaysOpen">
            <DrawerOverlay backdropFilter="blur(10px)" bg="rgba(0, 0, 0, 0.7)" />
            <DrawerContent
                borderTopRadius="32px"
                bg="#161920" // Темный фон как в профиле
                maxH="85vh" // Примерно 3/4 экрана
                color="white"
            >
                <Box w="40px" h="4px" bg="whiteAlpha.300" borderRadius="full" mx="auto" mt={3} />
                <DrawerCloseButton top="20px" right="20px" />

                <DrawerBody px={6} pt={4} pb={10}>
                    <VStack spacing={6} align="stretch">
                        {/* Изображение подарка */}
                        <Flex
                            justify="center"
                            align="center"
                            bg="radial-gradient(circle at center, rgba(232, 215, 253, 0.15) 0%, transparent 70%)"
                            borderRadius="24px"
                            py={8}
                        >
                            <Image
                                src={gift.image}
                                alt={gift.name}
                                w="200px"
                                h="200px"
                                objectFit="contain"
                                filter="drop-shadow(0 10px 20px rgba(0,0,0,0.5))"
                            />
                        </Flex>

                        {/* Заголовок и Редкость */}
                        <VStack align="flex-start" spacing={1}>
                            <HStack w="100%" justify="space-between" align="center">
                                <Text fontSize="24px" fontWeight="800" color="white">
                                    {gift.name}
                                </Text>
                                <Badge
                                    bg="#e8d7fd"
                                    color="#0F1115"
                                    px={3}
                                    py={1}
                                    borderRadius="12px"
                                    fontSize="12px"
                                    fontWeight="800"
                                >
                                    #{gift.num}
                                </Badge>
                            </HStack>
                            <Text fontSize="16px" color="gray.400" fontWeight="500">
                                {gift.collection}
                            </Text>
                        </VStack>

                        <Divider borderColor="whiteAlpha.100" />

                        {/* Детальная информация */}
                        <VStack align="stretch" spacing={4}>
                            <InfoRow label="Редкость" value={gift.rarity} valueColor={getRarityColor(gift.rarity)} />
                            <InfoRow
                                label="Рыночная цена"
                                value={`${gift.floorPrice} ${gift.currency}`}
                                valueColor="#e8d7fd"
                            />
                            <InfoRow label="ID предмета" value={gift.id.substring(0, 12) + "..."} />
                            <InfoRow label="Статус" value="В коллекции" />
                        </VStack>

                        {/* Кнопки действий */}
                        <HStack spacing={4} pt={4}>
                            <Button
                                flex={1}
                                h="56px"
                                bg="#e8d7fd"
                                color="#0F1115"
                                borderRadius="18px"
                                fontWeight="800"
                                _hover={{ opacity: 0.9 }}
                                _active={{ transform: "scale(0.98)" }}
                                onClick={() => {
                                    const slug = gift.name.toLowerCase().replace(/\s+/g, '')
                                    window.Telegram.WebApp.openLink(`https://fragment.com/gift/${slug}-${gift.num}`)
                                }}
                            >
                                Открыть на Fragment
                            </Button>
                        </HStack>
                    </VStack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}

// Вспомогательный компонент для строк инфо
const InfoRow = ({ label, value, valueColor = "white" }: { label: string; value: string; valueColor?: string }) => (
    <HStack justify="space-between">
        <Text color="gray.500" fontSize="14px" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px">
            {label}
        </Text>
        <Text color={valueColor} fontSize="15px" fontWeight="700">
            {value}
        </Text>
    </HStack>
)

export default GiftDetailDrawer