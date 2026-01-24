// src/components/overlay/SearchDrawer.tsx
import React, { useState, useEffect } from "react"
import {
  Box,
  Input,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  VStack,
  Spinner,
  Center,
  Icon,
  HStack,
  SimpleGrid,
  Collapse,
} from "@chakra-ui/react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { useNavigate } from "react-router-dom"
import { useOwnerSearch } from "../../views/Home/hooks/useOwnerSearch"
import { SearchResultItem } from "@components/SearchResultItem"
import { UserIcon, NftIcon, SearchIconBig } from "../Shared/Icons"

interface SearchDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const SearchDrawer: React.FC<SearchDrawerProps> = ({ isOpen, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchType, setSearchType] = useState<"PROFILE" | "NFT">("PROFILE")
  const [query, setQuery] = useState("")

  // Состояния для фильтров NFT
  const [nftGift, setNftGift] = useState("Все подарки")
  const [nftModel, setNftModel] = useState("")
  const [nftBackdrop, setNftBackdrop] = useState("Все фоны")
  const [nftPattern, setNftPattern] = useState("Все узоры")
  const [nftNumber, setNftNumber] = useState("")

  const navigate = useNavigate()
  const { results, isLoading } = useOwnerSearch(query, searchType)

  useEffect(() => {
    if (!isOpen) {
      setIsExpanded(false)
      setQuery("")
    }
  }, [isOpen])

  const handleUserClick = (user: any) => {
    onClose()
    navigate(`/user/${user.id}`)
  }

  // Стили для полей ввода (как на скриншоте)
  const fieldStyle = {
    bg: "whiteAlpha.50",
    border: "1px solid",
    borderColor: "whiteAlpha.100",
    borderRadius: "14px",
    p: "10px",
    fontSize: "14px",
    color: "white",
    width: "100%",
    _focus: { borderColor: "#00D1FF" }
  }

  const labelStyle = {
    fontSize: "11px",
    fontWeight: "800",
    color: "gray.500",
    mb: "6px",
    ml: "4px",
    textTransform: "uppercase" as const
  }

  return (
      <AnimatePresence>
        {isOpen && (
            <Box position="fixed" inset={0} zIndex={2000}>
              <Box
                  as={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  position="absolute"
                  inset={0}
                  bg="blackAlpha.800"
                  backdropFilter="blur(15px)"
                  onClick={onClose}
              />

              <Box
                  as={motion.div}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  position="absolute"
                  bottom={0} left={0} right={0}
                  maxH="90vh"
                  bg="#0F1115"
                  borderTopRadius="32px"
                  p={4}
                  display="flex"
                  flexDirection="column"
              >
                <Box w="40px" h="4px" bg="whiteAlpha.200" borderRadius="full" mx="auto" mb={6} />

                {/* Заголовок */}
                <HStack mb={4} px={2} justify="space-between">
                  <Text fontSize="20px" fontWeight="900">
                    {searchType === "PROFILE" ? "Поиск профиля" : "Поиск NFT"}
                  </Text>

                  <Menu autoSelect={false}>
                    <MenuButton as={Button} size="sm" variant="ghost" rightIcon={<ChevronDownIcon />}>
                      {searchType === "PROFILE" ? <UserIcon color="#e8d7fd" /> : <NftIcon color="#00D1FF" />}
                    </MenuButton>
                    <MenuList bg="#1F232E" border="none" borderRadius="15px">
                      <MenuItem onClick={() => setSearchType("PROFILE")} icon={<UserIcon color="#e8d7fd" />}>Профиль</MenuItem>
                      <MenuItem onClick={() => setSearchType("NFT")} icon={<NftIcon color="#00D1FF" />}>NFT</MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>

                {/* КОНТЕНТ: ЛИБО ПРОФИЛЬ, ЛИБО ФОРМА NFT */}
                <Box overflowY="auto" pb={6}>
                  {searchType === "PROFILE" ? (
                      <Box>
                        <Input
                            {...fieldStyle}
                            placeholder="Введите имя или username..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                        <Box mt={4}>
                          {isLoading ? (
                              <Center py={10}><Spinner color="brand.500" /></Center>
                          ) : (
                              <VStack align="stretch" spacing={2}>
                                {results.map(user => (
                                    <SearchResultItem key={user.id} user={user} onClick={handleUserClick} />
                                ))}
                              </VStack>
                          )}
                        </Box>
                      </Box>
                  ) : (
                      <VStack spacing={4} align="stretch" as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {/* Сетка фильтров NFT */}
                        <SimpleGrid columns={2} spacing={3}>
                          {/* Подарок */}
                          <Box>
                            <Text {...labelStyle}>Подарок</Text>
                            <Menu>
                              <MenuButton {...fieldStyle} textAlign="left" as={Button} rightIcon={<ChevronDownIcon />} variant="unstyled">
                                <Text isTruncated fontSize="13px">{nftGift}</Text>
                              </MenuButton>
                              <MenuList bg="#1F232E" border="none">
                                {["Все подарки", "Plush Pepe", "Loot Bag", "Durov’s Cap"].map(g => (
                                    <MenuItem key={g} onClick={() => setNftGift(g)}>{g}</MenuItem>
                                ))}
                              </MenuList>
                            </Menu>
                          </Box>

                          {/* Модель */}
                          <Box>
                            <Text {...labelStyle}>Модель</Text>
                            <Input {...fieldStyle} placeholder="Pepe..." value={nftModel} onChange={(e) => setNftModel(e.target.value)} />
                          </Box>

                          {/* Фон */}
                          <Box>
                            <Text {...labelStyle}>Фон</Text>
                            <Menu>
                              <MenuButton {...fieldStyle} textAlign="left" as={Button} rightIcon={<ChevronDownIcon />} variant="unstyled">
                                <Text isTruncated fontSize="13px">{nftBackdrop}</Text>
                              </MenuButton>
                              <MenuList bg="#1F232E" border="none">
                                {["Все фоны", "Arctic", "Matrix", "Nebula"].map(f => (
                                    <MenuItem key={f} onClick={() => setNftBackdrop(f)}>{f}</MenuItem>
                                ))}
                              </MenuList>
                            </Menu>
                          </Box>

                          {/* Узор */}
                          <Box>
                            <Text {...labelStyle}>Узор</Text>
                            <Menu>
                              <MenuButton {...fieldStyle} textAlign="left" as={Button} rightIcon={<ChevronDownIcon />} variant="unstyled">
                                <Text isTruncated fontSize="13px">{nftPattern}</Text>
                              </MenuButton>
                              <MenuList bg="#1F232E" border="none">
                                {["Все узоры", "Lines", "Dots", "Squares"].map(p => (
                                    <MenuItem key={p} onClick={() => setNftPattern(p)}>{p}</MenuItem>
                                ))}
                              </MenuList>
                            </Menu>
                          </Box>
                        </SimpleGrid>

                        {/* Номер (на всю ширину) */}
                        <Box>
                          <Text {...labelStyle}>Номер</Text>
                          <Input {...fieldStyle} placeholder="1, 2, 5-10" value={nftNumber} onChange={(e) => setNftNumber(e.target.value)} />
                        </Box>

                        {/* Кнопка Поиска */}
                        <Button
                            mt={4}
                            h="54px"
                            bg="white"
                            color="black"
                            borderRadius="18px"
                            fontWeight="900"
                            fontSize="16px"
                            _active={{ transform: "scale(0.98)", bg: "gray.200" }}
                            onClick={() => console.log("Searching NFT with filters...")}
                        >
                          Поиск
                        </Button>

                        <Text textAlign="center" fontSize="10px" color="gray.600" fontWeight="700">
                          Спасибо <Text as="span" color="#00D1FF">@GiftChanges</Text> за API
                        </Text>
                      </VStack>
                  )}
                </Box>
              </Box>
            </Box>
        )}
      </AnimatePresence>
  )
}

export default SearchDrawer