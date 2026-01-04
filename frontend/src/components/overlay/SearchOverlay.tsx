import React, { useState, useRef } from "react"
import {
  Box,
  Text,
  HStack,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Avatar,
  Center,
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import { ChevronDownIcon, CloseIcon, SearchIcon } from "@chakra-ui/icons"
import {
  SearchOverlayStyle,
  SearchBarContainer,
  SearchOptionsButtonStyle,
  SearchInputStyle,
  SearchBackdrop,
} from "../styles"

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [searchType, setSearchType] = useState<"ВЛАДЕЛЕЦ" | "NFT">("ВЛАДЕЛЕЦ")
  const [isExpanded, setIsExpanded] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  return (
    <>
      <Box
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={SearchBackdrop}
      />

      <Box
        as={motion.div}
        initial={{ y: "100%" }}
        animate={{ y: 0, height: isExpanded ? "92vh" : "55vh" }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={SearchOverlayStyle}
      >
        <Center pt={3} pb={1}>
          <Box w="40px" h="4px" bg="whiteAlpha.200" borderRadius="full" />
        </Center>

        <Box
          style={{
            ...SearchBarContainer,
            borderColor: isExpanded ? "#e8d7fd" : "rgba(255,255,255,0.1)",
          }}
        >
          <Menu>
            {/* Текст внутри кнопки теперь розовый */}
            <MenuButton style={{ ...SearchOptionsButtonStyle, color: "#ED2A4A" }}>
              <HStack spacing={1}>
                <Text fontSize="12px" fontWeight="900">
                  {searchType}
                </Text>
                <ChevronDownIcon />
              </HStack>
            </MenuButton>
            <MenuList bg="#1F232E" border="1px solid rgba(255,255,255,0.1)" borderRadius="16px">
              <MenuItem
                bg="transparent"
                _hover={{ bg: "whiteAlpha.100" }}
                onClick={() => setSearchType("ВЛАДЕЛЕЦ")}
                fontWeight="700"
              >
                ВЛАДЕЛЕЦ
              </MenuItem>
              <MenuItem
                bg="transparent"
                _hover={{ bg: "whiteAlpha.100" }}
                onClick={() => setSearchType("NFT")}
                fontWeight="700"
                isDisabled
                opacity={0.4}
              >
                NFT (СКОРО)
              </MenuItem>
            </MenuList>
          </Menu>

          <input
            ref={inputRef}
            style={{ ...SearchInputStyle, fontSize: "15px" }}
            placeholder={
              searchType === "ВЛАДЕЛЕЦ" ? "Ник, ID или юзернейм" : "Поиск по предметам..."
            }
            value={query}
            onFocus={() => setIsExpanded(true)}
            onChange={(e) => setQuery(e.target.value)}
          />

          {query && (
            <IconButton
              aria-label="clear"
              icon={<CloseIcon w={2.5} h={2.5} />}
              size="xs"
              variant="ghost"
              onClick={() => {
                setQuery("")
                setIsExpanded(false)
              }}
              mr={2}
            />
          )}
        </Box>

        <Box flex={1} px={4} overflowY="auto">
          {query ? (
            <VStack align="stretch" spacing={3}>
              <Text color="gray.500" fontSize="11px" fontWeight="800" letterSpacing="1px">
                РЕЗУЛЬТАТЫ ПОИСКА
              </Text>
              <HStack
                p={3}
                bg="whiteAlpha.50"
                borderRadius="16px"
                spacing={3}
                cursor="pointer"
                _active={{ bg: "whiteAlpha.100" }}
              >
                <Avatar size="sm" bg="#e8d7fd" name={query} />
                <VStack align="flex-start" spacing={0}>
                  <Text fontWeight="bold" fontSize="14px" color="#f15eb0">
                    @{query}
                  </Text>
                  <Text fontSize="12px" color="gray.500">
                    Нажмите, чтобы открыть профиль
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          ) : (
            <Center h="100%" flexDirection="column" opacity={0.3} pb="15vh">
              <SearchIcon w={10} h={10} mb={4} />
              <Text fontWeight="600" fontSize="14px" textAlign="center">
                Введите данные владельца <br /> для быстрого перехода
              </Text>
            </Center>
          )}
        </Box>
      </Box>
    </>
  )
}

export default SearchOverlay
