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
} from "@chakra-ui/react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { useNavigate } from "react-router-dom"
import { useOwnerSearch } from "../../views/Home/hooks/useOwnerSearch"
import { SearchResultItem } from "@components/SearchResultItem"
import { UserIcon, NftIcon } from "../Shared/Icons"

interface SearchDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const SearchDrawer: React.FC<SearchDrawerProps> = ({ isOpen, onClose }) => {
  const [searchType, setSearchType] = useState<"PROFILE" | "NFT">("PROFILE")
  const [query, setQuery] = useState("")

  const [nftGift, setNftGift] = useState("Все подарки")
  const [nftModel, setNftModel] = useState("")
  const [nftBackdrop, setNftBackdrop] = useState("Все фоны")
  const [nftPattern, setNftPattern] = useState("Все узоры")
  const [nftNumber, setNftNumber] = useState("")

  const navigate = useNavigate()
  const { results, isLoading } = useOwnerSearch(query, searchType)

  // Блокировка скролла основного окна
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.height = "100vh"
    } else {
      document.body.style.overflow = "auto"
      document.body.style.height = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
      document.body.style.height = "auto"
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) setQuery("")
  }, [isOpen])

  const handleUserClick = (user: any) => {
    onClose()
    navigate(`/user/${user.id}`)
  }

  const fieldContainerStyle = {
    position: "relative" as const,
    bg: "whiteAlpha.50",
    border: "1px solid",
    borderColor: "whiteAlpha.100",
    borderRadius: "14px",
    width: "100%",
  }

  const arrowIconStyle = {
    position: "absolute" as const,
    top: "12px",
    right: "10px",
    fontSize: "12px",
    color: "whiteAlpha.400",
    pointerEvents: "none" as const,
  }

  const inputStyle = {
    bg: "transparent",
    border: "none",
    fontSize: "16px",
    color: "white",
    width: "100%",
    p: "12px",
    pr: "30px",
    _focus: { boxShadow: "none" },
  }

  const labelStyle = {
    fontSize: "11px",
    fontWeight: "800",
    color: "gray.500",
    mb: "6px",
    ml: "4px",
    textTransform: "uppercase" as const,
  }

  // НОВАЯ ВЫСОТА: на 1/5 меньше чем 90vh
  const drawerHeight = "80vh"

  return (
    <AnimatePresence>
      {isOpen && (
        <Box position="fixed" top={0} left={0} right={0} bottom={0} zIndex={2000} overflow="hidden">
          {/* ФОН С БЛЮРОМ */}
          <Box
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            position="absolute"
            inset={0}
            bg="rgba(15, 17, 21, 0.9)"
            backdropFilter="blur(20px)"
            onClick={onClose}
          />

          {/* ТЕКСТ IN'SNAP - ПРИЖАТ К ВЕРХУ */}
          <Box
            position="absolute"
            top="calc(env(safe-area-inset-top) + 20px)"
            left={0}
            right={0}
            textAlign="center"
            pointerEvents="none"
          >
            <Text
              as={motion.span}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.03 }}
              fontSize="12vw"
              fontWeight="900"
              color="white"
              letterSpacing="2px"
            >
              IN'SNAP
            </Text>
          </Box>

          {/* КОНТЕНТ ШТОРКИ */}
          <Box
            as={motion.div}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            maxH={drawerHeight} // Применяем новую высоту здесь
            bg="#0F1115"
            borderTopRadius="36px"
            p={4}
            pb="calc(20px + env(safe-area-inset-bottom))"
            display="flex"
            flexDirection="column"
            boxShadow="0 -10px 40px rgba(0,0,0,0.5)"
          >
            <Box
              w="40px"
              h="4px"
              bg="whiteAlpha.200"
              borderRadius="full"
              mx="auto"
              mb={6}
              flexShrink={0}
            />

            <Flex mb={6} px={2} justify="space-between" align="center" flexShrink={0}>
              <Text fontSize="20px" fontWeight="900">
                Поиск
              </Text>

              <Menu autoSelect={false}>
                <MenuButton
                  as={Button}
                  variant="unstyled"
                  bg="whiteAlpha.50"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  borderRadius="12px"
                  px={3}
                  h="38px"
                >
                  <HStack spacing={2}>
                    {searchType === "PROFILE" ? (
                      <UserIcon boxSize="16px" color="#e8d7fd" />
                    ) : (
                      <NftIcon boxSize="16px" color="#00D1FF" />
                    )}
                    <Text fontSize="12px" fontWeight="800" color="white">
                      {searchType === "PROFILE" ? "ПРОФИЛЬ" : "NFT"}
                    </Text>
                    <ChevronDownIcon color="gray.500" />
                  </HStack>
                </MenuButton>
                <MenuList
                  bg="#1F232E"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  borderRadius="16px"
                >
                  <MenuItem
                    bg="transparent"
                    onClick={() => setSearchType("PROFILE")}
                    icon={<UserIcon color="#e8d7fd" />}
                  >
                    Профиль
                  </MenuItem>
                  <MenuItem
                    bg="transparent"
                    onClick={() => setSearchType("NFT")}
                    icon={<NftIcon color="#00D1FF" />}
                  >
                    NFT
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>

            {/* КОНТЕНТ ФОРМЫ */}
            <Box overflowY="auto" pb={4} px={1}>
              {searchType === "PROFILE" ? (
                <Box>
                  <Box {...fieldContainerStyle}>
                    <Input
                      {...inputStyle}
                      placeholder="Введите имя или username..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </Box>
                  <Box mt={4}>
                    {isLoading ? (
                      <Center py={10}>
                        <Spinner color="brand.500" />
                      </Center>
                    ) : (
                      <VStack align="stretch" spacing={2}>
                        {results.map((user) => (
                          <SearchResultItem key={user.id} user={user} onClick={handleUserClick} />
                        ))}
                      </VStack>
                    )}
                  </Box>
                </Box>
              ) : (
                <VStack spacing={5} align="stretch">
                  <Center>
                    <Box
                      w="110px"
                      h="110px"
                      borderRadius="28px"
                      bg="whiteAlpha.50"
                      border="2px dashed"
                      borderColor="whiteAlpha.100"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <VStack spacing={1}>
                        <NftIcon boxSize="20px" color="whiteAlpha.200" />
                        <Text
                          fontSize="8px"
                          fontWeight="800"
                          color="whiteAlpha.400"
                          textAlign="center"
                        >
                          ВЫБЕРИТЕ ПОДАРOK
                        </Text>
                      </VStack>
                    </Box>
                  </Center>

                  <SimpleGrid columns={2} spacing={3}>
                    <Box>
                      <Text {...labelStyle}>Подарок</Text>
                      <Box {...fieldContainerStyle}>
                        <Menu matchWidth>
                          <MenuButton
                            as={Button}
                            {...inputStyle}
                            textAlign="left"
                            variant="unstyled"
                          >
                            <Text isTruncated fontSize="14px">
                              {nftGift}
                            </Text>
                          </MenuButton>
                          <MenuList bg="#1F232E" border="none">
                            {["Все подарки", "Plush Pepe", "Loot Bag"].map((g) => (
                              <MenuItem key={g} bg="transparent" onClick={() => setNftGift(g)}>
                                {g}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </Menu>
                        <Icon as={ChevronDownIcon} {...arrowIconStyle} />
                      </Box>
                    </Box>

                    <Box>
                      <Text {...labelStyle}>Модель</Text>
                      <Box {...fieldContainerStyle}>
                        <Input
                          {...inputStyle}
                          placeholder="Pepe..."
                          value={nftModel}
                          onChange={(e) => setNftModel(e.target.value)}
                        />
                        <Icon as={ChevronDownIcon} {...arrowIconStyle} />
                      </Box>
                    </Box>

                    <Box>
                      <Text {...labelStyle}>Фон</Text>
                      <Box {...fieldContainerStyle}>
                        <Menu matchWidth>
                          <MenuButton
                            as={Button}
                            {...inputStyle}
                            textAlign="left"
                            variant="unstyled"
                          >
                            <Text isTruncated fontSize="14px">
                              {nftBackdrop}
                            </Text>
                          </MenuButton>
                          <MenuList bg="#1F232E" border="none">
                            {["Все фоны", "Arctic", "Matrix"].map((f) => (
                              <MenuItem key={f} bg="transparent" onClick={() => setNftBackdrop(f)}>
                                {f}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </Menu>
                        <Icon as={ChevronDownIcon} {...arrowIconStyle} />
                      </Box>
                    </Box>

                    <Box>
                      <Text {...labelStyle}>Узор</Text>
                      <Box {...fieldContainerStyle}>
                        <Menu matchWidth>
                          <MenuButton
                            as={Button}
                            {...inputStyle}
                            textAlign="left"
                            variant="unstyled"
                          >
                            <Text isTruncated fontSize="14px">
                              {nftPattern}
                            </Text>
                          </MenuButton>
                          <MenuList bg="#1F232E" border="none">
                            {["Все узоры", "Lines", "Dots"].map((p) => (
                              <MenuItem key={p} bg="transparent" onClick={() => setNftPattern(p)}>
                                {p}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </Menu>
                        <Icon as={ChevronDownIcon} {...arrowIconStyle} />
                      </Box>
                    </Box>
                  </SimpleGrid>

                  <Box>
                    <Text {...labelStyle}>Номер</Text>
                    <Box {...fieldContainerStyle}>
                      <Input
                        {...inputStyle}
                        placeholder="1, 2, 5-10"
                        value={nftNumber}
                        onChange={(e) => setNftNumber(e.target.value)}
                      />
                      <Icon as={ChevronDownIcon} {...arrowIconStyle} />
                    </Box>
                  </Box>

                  <Button
                    mt={2}
                    h="54px"
                    bg="white"
                    color="black"
                    borderRadius="18px"
                    fontWeight="900"
                    _active={{ transform: "scale(0.98)" }}
                  >
                    Поиск
                  </Button>
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
