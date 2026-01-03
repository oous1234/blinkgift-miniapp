import React from "react"
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    VStack,
    HStack,
    Text,
    Switch,
    Box,
    Divider,
} from "@chakra-ui/react"

interface SettingsDrawerProps {
    isOpen: boolean
    onClose: () => void
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose }) => {
    return (
        <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
            {/*
         DrawerOverlay - это затемнение экрана.
         Добавляем backdropFilter для эффекта блюра верхней части.
      */}
            <DrawerOverlay backdropFilter="blur(8px)" bg="rgba(0, 0, 0, 0.6)" />

            <DrawerContent
                borderTopRadius="24px"
                bg="#1F232E" // Цвет карточек из ваших стилей
                color="white"
                mb={0} // Прижимаем к низу
            >
                <Box w="40px" h="4px" bg="gray.600" borderRadius="full" mx="auto" mt={3} mb={1} />

                <DrawerHeader borderBottomWidth="0px" textAlign="center" fontSize="lg">
                    Settings
                </DrawerHeader>

                <DrawerBody>
                    <VStack spacing={4} align="stretch">

                        {/* 1. Выбор языка */}
                        <HStack justify="space-between" bg="rgba(255,255,255,0.03)" p={3} borderRadius="16px">
                            <Text fontWeight="500">Language</Text>
                            <HStack spacing={1} bg="rgba(0,0,0,0.2)" p={1} borderRadius="10px">
                                <Button size="xs" colorScheme="blue" variant="solid" borderRadius="8px">EN</Button>
                                <Button size="xs" color="gray.400" variant="ghost" _hover={{ bg: 'whiteAlpha.100' }}>RU</Button>
                            </HStack>
                        </HStack>

                        {/* 2. Уведомления */}
                        <HStack justify="space-between" bg="rgba(255,255,255,0.03)" p={3} borderRadius="16px">
                            <Text fontWeight="500">Notifications</Text>
                            <Switch colorScheme="blue" size="md" defaultChecked />
                        </HStack>

                        {/* 3. Пользовательское соглашение */}
                        <HStack
                            as="button"
                            justify="space-between"
                            bg="rgba(255,255,255,0.03)"
                            p={3}
                            borderRadius="16px"
                            _active={{ bg: "rgba(255,255,255,0.08)" }}
                        >
                            <Text fontWeight="500">User Agreement</Text>
                            <Text fontSize="xl" color="gray.500">›</Text>
                        </HStack>

                    </VStack>
                </DrawerBody>

                <DrawerFooter pb={8}>
                    <HStack w="100%" spacing={3}>
                        {/* Кнопка Чат */}
                        <Button
                            flex={1}
                            height="50px"
                            borderRadius="16px"
                            bg="rgba(255,255,255,0.05)"
                            _hover={{ bg: "rgba(255,255,255,0.1)" }}
                            _active={{ bg: "rgba(255,255,255,0.15)" }}
                            color="white"
                            leftIcon={<span style={{ fontSize: '18px' }}>💬</span>}
                        >
                            Chat
                        </Button>

                        {/* Кнопка Поддержка */}
                        <Button
                            flex={1}
                            height="50px"
                            borderRadius="16px"
                            bg="blue.500"
                            _hover={{ bg: "blue.400" }}
                            _active={{ bg: "blue.600" }}
                            color="white"
                            leftIcon={<span style={{ fontSize: '18px' }}>🎧</span>}
                        >
                            Support
                        </Button>
                    </HStack>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default SettingsDrawer