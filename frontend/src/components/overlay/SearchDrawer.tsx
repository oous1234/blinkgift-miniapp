import React, { useState, useRef, useEffect } from "react"
import {
    Box,
    Input,
    Flex,
    Text,
    Icon,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    VStack,
    Avatar,
    Spinner,
    Center
} from "@chakra-ui/react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { useOwnerSearch } from "../../views/Home/hooks/useOwnerSearch" // Импорт хука

// Иконки
const UserIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)
const NftIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
)

interface SearchDrawerProps {
    isOpen: boolean
    onClose: () => void
}

type SearchType = "PROFILE" | "NFT"

const SearchDrawer: React.FC<SearchDrawerProps> = ({ isOpen, onClose }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [searchType, setSearchType] = useState<SearchType>("PROFILE")
    const [query, setQuery] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    // Подключаем наш хук поиска
    const { results, isLoading } = useOwnerSearch(query, searchType)

    useEffect(() => {
        if (!isOpen) {
            setIsExpanded(false)
            setQuery("")
        }
    }, [isOpen])

    const handleInputFocus = () => {
        setIsExpanded(true)
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (info.offset.y > 100 || info.velocity.y > 300) {
            onClose()
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <Box position="fixed" top="0" left="0" right="0" bottom="0" zIndex={2000}>
                    {/* Backdrop + Branding */}
                    <Box
                        as={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        position="absolute"
                        inset="0"
                        bg="rgba(0, 0, 0, 0.6)"
                        backdropFilter="blur(15px)"
                        onClick={handleBackdropClick}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="flex-start"
                        pt="15vh"
                    >
                        <AnimatePresence>
                            {isExpanded && (
                                <Text
                                    as={motion.div}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    fontSize="48px"
                                    fontWeight="900"
                                    color="whiteAlpha.200"
                                    letterSpacing="4px"
                                    pointerEvents="none"
                                    fontFamily="'Montserrat', sans-serif"
                                >
                                    IN'SNAP
                                </Text>
                            )}
                        </AnimatePresence>
                    </Box>

                    {/* Sliding Drawer Content */}
                    <Box
                        as={motion.div}
                        initial={{ y: "100%" }}
                        animate={{ y: isExpanded ? "20%" : "0" }}
                        exit={{ y: "100%" }}
                        transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
                        drag="y"
                        dragConstraints={{ top: 0 }}
                        dragElastic={{ top: 0, bottom: 0.2 }}
                        onDragEnd={handleDragEnd}
                        position="absolute"
                        bottom="0"
                        left="0"
                        right="0"
                        height={isExpanded ? "85vh" : "auto"}
                        bg="#161920"
                        borderTopRadius="32px"
                        borderTop="1px solid rgba(255, 255, 255, 0.08)"
                        boxShadow="0 -10px 40px rgba(0,0,0,0.5)"
                        display="flex"
                        flexDirection="column"
                    >
                        {/* Drag Handle */}
                        <Box w="100%" pt="12px" pb="8px" display="flex" justifyContent="center">
                            <Box w="40px" h="4px" bg="whiteAlpha.200" borderRadius="full" />
                        </Box>

                        {/* Search Bar Container */}
                        <Box px="16px" pb="24px" pt="4px">
                            <Flex
                                bg="rgba(255, 255, 255, 0.05)"
                                borderRadius="20px"
                                border="1px solid rgba(255, 255, 255, 0.1)"
                                align="center"
                                h="56px"
                                px="8px"
                                transition="all 0.3s ease"
                                _focusWithin={{
                                    borderColor: "#e8d7fd",
                                    boxShadow: "0 0 0 1px rgba(232, 215, 253, 0.3)",
                                }}
                            >
                                {/* Filter Selector */}
                                <Menu offset={[0, 8]}>
                                    <MenuButton
                                        as={Button}
                                        variant="ghost"
                                        h="40px"
                                        borderRadius="14px"
                                        px="12px"
                                        color={searchType === "PROFILE" ? "#e8d7fd" : "white"}
                                        bg={searchType === "PROFILE" ? "rgba(232, 215, 253, 0.1)" : "transparent"}
                                        _hover={{ bg: "whiteAlpha.100" }}
                                        _active={{ bg: "whiteAlpha.200" }}
                                        leftIcon={searchType === "PROFILE" ? <UserIcon /> : <NftIcon />}
                                        rightIcon={<ChevronDownIcon opacity={0.6} />}
                                        fontSize="13px"
                                        fontWeight="700"
                                        mr="4px"
                                    >
                                        {searchType === "PROFILE" ? "Profile" : "NFT"}
                                    </MenuButton>
                                    <MenuList
                                        bg="#1F232E"
                                        borderColor="whiteAlpha.100"
                                        borderRadius="16px"
                                        p="6px"
                                        zIndex={2001}
                                    >
                                        <MenuItem
                                            icon={<Box as={UserIcon} />}
                                            onClick={() => setSearchType("PROFILE")}
                                            bg={searchType === "PROFILE" ? "whiteAlpha.100" : "transparent"}
                                            borderRadius="10px"
                                            mb="4px"
                                            _hover={{ bg: "whiteAlpha.200" }}
                                        >
                                            <VStack align="start" spacing={0}>
                                                <Text fontSize="14px" fontWeight="600">
                                                    Profile
                                                </Text>
                                                <Text fontSize="10px" color="gray.500">
                                                    @username or ID
                                                </Text>
                                            </VStack>
                                        </MenuItem>
                                        <MenuItem
                                            icon={<Box as={NftIcon} />}
                                            onClick={() => setSearchType("NFT")}
                                            bg={searchType === "NFT" ? "whiteAlpha.100" : "transparent"}
                                            borderRadius="10px"
                                            _hover={{ bg: "whiteAlpha.200" }}
                                        >
                                            <VStack align="start" spacing={0}>
                                                <Text fontSize="14px" fontWeight="600">
                                                    NFT Collection
                                                </Text>
                                                <Text fontSize="10px" color="gray.500">
                                                    Name or Address
                                                </Text>
                                            </VStack>
                                        </MenuItem>
                                    </MenuList>
                                </Menu>

                                {/* Input Field */}
                                <Input
                                    ref={inputRef}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onFocus={handleInputFocus}
                                    placeholder={searchType === "PROFILE" ? "Find user..." : "Search collectibles..."}
                                    variant="unstyled"
                                    color="white"
                                    fontSize="16px"
                                    fontWeight="500"
                                    px="8px"
                                    h="100%"
                                />
                            </Flex>
                        </Box>

                        {/* Expanded Content (Results) */}
                        {isExpanded && (
                            <Box
                                flex="1"
                                px="20px"
                                overflowY="auto"
                                pb="40px"
                                onPointerDown={(e) => e.stopPropagation()}
                            >
                                <Text
                                    color="gray.500"
                                    fontSize="13px"
                                    fontWeight="600"
                                    mb="16px"
                                    textTransform="uppercase"
                                >
                                    {query ? "Search Results" : "Recent Searches"}
                                </Text>

                                <VStack spacing="8px" align="stretch">
                                    {/* Лоадер */}
                                    {isLoading && (
                                        <Center py={4}>
                                            <Spinner color="#e8d7fd" />
                                        </Center>
                                    )}

                                    {/* Результаты поиска */}
                                    {!isLoading && query && results.length > 0 && results.map((user) => (
                                        <Flex
                                            key={user.id}
                                            align="center"
                                            p="12px"
                                            bg="rgba(255,255,255,0.03)"
                                            borderRadius="16px"
                                            cursor="pointer"
                                            _active={{ bg: "rgba(255,255,255,0.08)" }}
                                        >
                                            {/* Аватар или иконка */}
                                            <Box mr="12px">
                                                <Avatar
                                                    name={user.name || user.username}
                                                    bg="whiteAlpha.100"
                                                    color="gray.400"
                                                    size="sm"
                                                    borderRadius="10px"
                                                    icon={<Icon as={UserIcon} />}
                                                />
                                            </Box>

                                            <VStack align="start" spacing={0} flex={1}>
                                                <Text fontSize="14px" fontWeight="600" color="white">
                                                    {user.name || "Unknown User"}
                                                </Text>
                                                <Text fontSize="11px" color="gray.500">
                                                    {user.username ? `@${user.username}` : `ID: ${user.telegram_id}`}
                                                </Text>
                                            </VStack>

                                            {/* Доп инфо (количество подарков) */}
                                            {user.gifts_count !== undefined && (
                                                <Box bg="whiteAlpha.100" px={2} py={1} borderRadius="8px">
                                                    <Text fontSize="10px" fontWeight="700" color="gray.400">
                                                        {user.gifts_count} Gifts
                                                    </Text>
                                                </Box>
                                            )}
                                        </Flex>
                                    ))}

                                    {/* Пустое состояние */}
                                    {!isLoading && query && results.length === 0 && (
                                        <Center py={8} flexDirection="column">
                                            <Text color="gray.500" fontSize="sm">No users found</Text>
                                        </Center>
                                    )}

                                    {/* Заглушка, если нет запроса (Recent Searches) */}
                                    {!query && [1, 2, 3].map((i) => (
                                        <Flex
                                            key={i}
                                            align="center"
                                            p="12px"
                                            bg="rgba(255,255,255,0.03)"
                                            borderRadius="16px"
                                            cursor="pointer"
                                            _active={{ bg: "rgba(255,255,255,0.08)" }}
                                        >
                                            <Box
                                                bg="whiteAlpha.100"
                                                p="8px"
                                                borderRadius="10px"
                                                mr="12px"
                                                color="gray.400"
                                            >
                                                <Icon as={searchType === "PROFILE" ? UserIcon : NftIcon} />
                                            </Box>
                                            <VStack align="start" spacing={0}>
                                                <Text fontSize="14px" fontWeight="600">
                                                    {searchType === "PROFILE" ? `User_00${i}` : `Gem #${4920 + i}`}
                                                </Text>
                                                <Text fontSize="11px" color="gray.500">
                                                    {searchType === "PROFILE" ? "View Profile" : "Rare • Alchemist"}
                                                </Text>
                                            </VStack>
                                        </Flex>
                                    ))}
                                </VStack>
                            </Box>
                        )}
                    </Box>
                </Box>
            )}
        </AnimatePresence>
    )
}

export default SearchDrawer
</file>