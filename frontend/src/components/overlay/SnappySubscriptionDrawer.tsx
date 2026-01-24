// frontend/src/components/overlay/SnappySubscriptionDrawer.tsx

import React from "react"
import {
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    VStack,
    HStack,
    Text,
    Box,
    Button,
    Icon,
    Flex,
    Divider,
} from "@chakra-ui/react"
import { CheckIcon } from "@chakra-ui/icons"
import { StarsIcon, TonIconBlue } from "../Shared/Icons"

interface SnappySubscriptionDrawerProps {
    isOpen: boolean
    onClose: () => void
}

const features = [
    { title: "Детальная аналитика", desc: "История цен и глубокий P/L для каждого NFT" },
    { title: "Приоритетный поиск", desc: "Находите редкие гифты быстрее остальных" },
    { title: "Отключение рекламы", desc: "Чистый интерфейс без баннеров" },
    { title: "Эксклюзивный значок", desc: "Особая рамка профиля ✨" },
]

const SnappySubscriptionDrawer: React.FC<SnappySubscriptionDrawerProps> = ({ isOpen, onClose }) => {
    return (
        <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
            <DrawerOverlay backdropFilter="blur(10px)" bg="blackAlpha.700" />
            <DrawerContent borderTopRadius="32px" bg="#0F1115" color="white">
                <Box w="40px" h="4px" bg="whiteAlpha.300" borderRadius="full" mx="auto" mt={3} />
                <DrawerCloseButton mt={2} />

                <DrawerBody px={6} pt={8} pb={10}>
                    <VStack spacing={6} align="stretch">
                        {/* Header */}
                        <VStack spacing={1} textAlign="center">
                            <Text fontSize="28px" fontWeight="900" letterSpacing="-1px">
                                Snappy<Text as="span" color="brand.500">+</Text>
                            </Text>
                            <Text color="gray.500" fontSize="14px" fontWeight="600">
                                Разблокируйте все возможности сервиса
                            </Text>
                        </VStack>

                        {/* Features List */}
                        <VStack spacing={4} align="stretch" py={4}>
                            {features.map((f, i) => (
                                <HStack key={i} spacing={4} align="flex-start">
                                    <Flex
                                        bg="brand.500"
                                        boxSize="24px"
                                        borderRadius="full"
                                        align="center"
                                        justify="center"
                                        flexShrink={0}
                                        mt={0.5}
                                    >
                                        <CheckIcon color="black" boxSize="12px" />
                                    </Flex>
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="800" fontSize="15px">{f.title}</Text>
                                        <Text fontSize="12px" color="gray.500" fontWeight="500">{f.desc}</Text>
                                    </VStack>
                                </HStack>
                            ))}
                        </VStack>

                        <Divider borderColor="whiteAlpha.100" />

                        {/* Payment Options */}
                        <VStack spacing={3}>
                            <Text fontSize="11px" fontWeight="900" color="gray.600" textTransform="uppercase">
                                Выберите способ оплаты (1 месяц)
                            </Text>

                            <Button
                                w="100%"
                                h="56px"
                                bg="white"
                                color="black"
                                borderRadius="20px"
                                leftIcon={<StarsIcon boxSize="20px" />}
                                _active={{ transform: "scale(0.98)" }}
                                fontWeight="900"
                                fontSize="16px"
                            >
                                150 Stars
                            </Button>

                            <Button
                                w="100%"
                                h="56px"
                                bg="whiteAlpha.100"
                                color="white"
                                borderRadius="20px"
                                leftIcon={<TonIconBlue boxSize="20px" />}
                                _active={{ transform: "scale(0.98)" }}
                                fontWeight="900"
                                fontSize="16px"
                            >
                                1.5 TON
                            </Button>
                        </VStack>

                        <Text textAlign="center" fontSize="10px" color="gray.600" px={4}>
                            Подписка активируется мгновенно после подтверждения транзакции.
                        </Text>
                    </VStack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}

export default SnappySubscriptionDrawer