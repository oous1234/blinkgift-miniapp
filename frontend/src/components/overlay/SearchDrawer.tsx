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
  Center,
  Badge,
  HStack
} from "@chakra-ui/react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { useOwnerSearch } from "../../views/Home/hooks/useOwnerSearch"
import { useNavigate } from "react-router-dom"

// --- ИКОНКИ ---

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const NftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
)

const GiftIconMini = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
)

// Большая лупа для пустого состояния
const BigSearchIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
  const navigate = useNavigate()

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

  const getTypeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'channel': return 'cyan'
      case 'bot': return 'purple'
      case 'user': return 'green'
      default: return 'gray'
    }
  }

  const handleUserClick = (user: any) => {
    onClose()
    navigate(`/user/${user.id}`, {
      state: {
        name: user.name,
        username: user.username,
        avatarUrl: user.username ? `https://poso.see.tg/api/avatar/${user.username}` : undefined
      }
    })
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

                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={handleInputFocus}
                  placeholder={
                    searchType === "PROFILE"
                      ? "ID или имя пользователя..."
                      : "Search collectibles..."
                  }
                  variant="unstyled"
                  color="white"
                  fontSize="16px"
                  fontWeight="500"
                  px="8px"
                  h="100%"
                />
              </Flex>
            </Box>

            {/* Expanded Content */}
            {isExpanded && (
              <Box
                flex="1"
                px="20px"
                overflowY="auto"
                pb="40px"
                onPointerDown={(e) => e.stopPropagation()}
              >
                {/* Если есть запрос, показываем заголовок */}
                {query && (
                  <Text
                    color="gray.500"
                    fontSize="13px"
                    fontWeight="600"
                    mb="16px"
                    textTransform="uppercase"
                  >
                    Search Results
                  </Text>
                )}

                <VStack spacing="8px" align="stretch">
                  {/* Лоадер */}
                  {isLoading && (
                    <Center py={4}>
                      <Spinner color="#e8d7fd" />
                    </Center>
                  )}

                  {/* Результаты поиска */}
                  {!isLoading &&
                    query &&
                    results.length > 0 &&
                    results.map((user) => (
                      <Flex
                        key={user.id}
                        onClick={() => handleUserClick(user)}
                        align="center"
                        p="12px"
                        bg="rgba(255,255,255,0.03)"
                        borderRadius="16px"
                        cursor="pointer"
                        _active={{ bg: "rgba(255,255,255,0.08)" }}
                      >
                        <Box mr="12px">
                          <Avatar
                            src={
                              user.username
                                ? `https://poso.see.tg/api/avatar/${user.username}`
                                : undefined
                            }
                            name={user.name || user.username}
                            bg="whiteAlpha.100"
                            color="gray.400"
                            size="sm"
                            borderRadius="10px"
                            icon={<Icon as={UserIcon} />}
                          />
                        </Box>

                        <VStack align="start" spacing="2px" flex={1} overflow="hidden">
                          <HStack spacing={2}>
                            <Text
                              fontSize="14px"
                              fontWeight="600"
                              color="white"
                              isTruncated
                              maxW="150px"
                            >
                              {user.name || "Unknown User"}
                            </Text>

                            {user.telegram_type && (
                              <Badge
                                colorScheme={getTypeColor(user.telegram_type)}
                                variant="subtle"
                                fontSize="9px"
                                borderRadius="6px"
                                px={1.5}
                                textTransform="uppercase"
                              >
                                {user.telegram_type}
                              </Badge>
                            )}
                          </HStack>

                          <Text fontSize="11px" color="gray.500">
                            {user.username ? `@${user.username}` : `ID: ${user.telegram_id}`}
                          </Text>
                        </VStack>

                        {user.gifts_count !== undefined && (
                          <HStack
                            bg="whiteAlpha.100"
                            px="8px"
                            py="4px"
                            borderRadius="8px"
                            spacing={1.5}
                          >
                            <Icon as={GiftIconMini} color="#e8d7fd" opacity={0.8} />
                            <Text fontSize="12px" fontWeight="700" color="white">
                              {user.gifts_count}
                            </Text>
                          </HStack>
                        )}
                      </Flex>
                    ))}

                  {/* Ничего не найдено */}
                  {!isLoading && query && results.length === 0 && (
                    <Center py={8} flexDirection="column">
                      <Text color="gray.500" fontSize="sm">
                        No users found
                      </Text>
                    </Center>
                  )}

                  {/* ПУСТОЕ СОСТОЯНИЕ (Начальный экран) */}
                  {!query && (
                    <Center flexDirection="column" py={16} color="whiteAlpha.300">
                      <Icon as={BigSearchIcon} mb={4} />
                      <Text fontSize="14px" fontWeight="500" color="whiteAlpha.500">
                        Найду все твои секреты...
                      </Text>
                    </Center>
                  )}
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