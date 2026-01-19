// src/components/overlay/SearchDrawer.tsx
import React, { useState, useEffect } from "react"
import { Box, Input, Flex, Text, Menu, MenuButton, MenuList, MenuItem, Button, VStack, Spinner, Center, Icon } from "@chakra-ui/react"
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
        <Box position="fixed" inset={0} zIndex={2000}>
          {/* Backdrop */}
          <Box
            as={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            position="absolute"
            inset={0}
            bg="blackAlpha.700"
            backdropFilter="blur(15px)"
            onClick={onClose}
          />

          {/* Drawer Content */}
          <Box
            as={motion.div}
            initial={{ y: "100%" }}
            animate={{ y: isExpanded ? "15%" : "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            position="absolute"
            bottom={0} left={0} right={0}
            height={isExpanded ? "85vh" : "auto"}
            bg="#161920"
            borderTopRadius="32px"
            p={4}
            display="flex"
            flexDirection="column"
          >
            <Box w="40px" h="4px" bg="whiteAlpha.200" borderRadius="full" mx="auto" mb={6} />

            {/* Search Bar */}
            <Flex bg="whiteAlpha.50" borderRadius="20px" p={1} align="center" mb={6}>
              <Menu>
                <MenuButton as={Button} variant="ghost" size="sm" leftIcon={searchType === "PROFILE" ? <UserIcon /> : <NftIcon />} rightIcon={<ChevronDownIcon />}>
                  {searchType === "PROFILE" ? "Profile" : "NFT"}
                </MenuButton>
                <MenuList bg="#1F232E" border="none">
                  <MenuItem onClick={() => setSearchType("PROFILE")} icon={<UserIcon />}>Profile</MenuItem>
                  <MenuItem onClick={() => setSearchType("NFT")} icon={<NftIcon />}>NFT Collection</MenuItem>
                </MenuList>
              </Menu>
              <Input
                variant="unstyled"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                px={3}
              />
            </Flex>

            {/* Results Area */}
            {isExpanded && (
              <Box flex={1} overflowY="auto" pb={10}>
                {isLoading ? (
                  <Center py={10}><Spinner color="brand.500" /></Center>
                ) : query && results.length > 0 ? (
                  <VStack align="stretch" spacing={2}>
                    {results.map(user => (
                      <SearchResultItem key={user.id} user={user} onClick={handleUserClick} />
                    ))}
                  </VStack>
                ) : (
                  <Center py={20} flexDirection="column" opacity={0.3}>
                    <SearchIconBig />
                    <Text mt={4}>{query ? "Ничего не найдено" : "Начни вводить имя..."}</Text>
                  </Center>
                )}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </AnimatePresence>
  )
}

export default SearchDrawer