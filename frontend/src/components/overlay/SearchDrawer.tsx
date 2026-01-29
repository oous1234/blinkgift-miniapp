import React, { useState, useEffect } from "react"
import { Box, Flex, Text, Menu, MenuButton, MenuList, MenuItem, Button, HStack } from "@chakra-ui/react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { useNavigate } from "react-router-dom"
import { UserIcon, NftIcon } from "../Shared/Icons"

import { ProfileSearchSection } from "./ProfileSearchSection"
import { NftSearchSection } from "./NftSearchSection"

interface SearchDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const SearchDrawer: React.FC<SearchDrawerProps> = ({ isOpen, onClose }) => {
  const [searchType, setSearchType] = useState<"PROFILE" | "NFT">("PROFILE")
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
      setQuery("")
    }
  }, [isOpen])

  const handleUserClick = (user: any) => {
    onClose()
    navigate(`/user/${user.id}`)
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
            bg="rgba(15, 17, 21, 0.9)"
            backdropFilter="blur(20px)"
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
            maxH="85vh"
            bg="#0F1115"
            borderTopRadius="36px"
            p={4}
            pb="calc(20px + env(safe-area-inset-bottom))"
            display="flex"
            flexDirection="column"
          >
            <Box w="40px" h="4px" bg="whiteAlpha.200" borderRadius="full" mx="auto" mb={6} />

            <Flex mb={6} px={2} justify="space-between" align="center">
              <Text fontSize="20px" fontWeight="900">Поиск</Text>
              
              <Menu autoSelect={false}>
                <MenuButton as={Button} size="sm" variant="outline" borderColor="whiteAlpha.100" borderRadius="12px">
                  <HStack spacing={2}>
                    {searchType === "PROFILE" ? <UserIcon boxSize="14px" color="#e8d7fd" /> : <NftIcon boxSize="14px" color="#00D1FF" />}
                    <Text fontSize="12px">{searchType}</Text>
                    <ChevronDownIcon />
                  </HStack>
                </MenuButton>
                <MenuList bg="#1F232E" border="none">
                  <MenuItem onClick={() => setSearchType("PROFILE")}>Профиль</MenuItem>
                  <MenuItem onClick={() => setSearchType("NFT")}>NFT</MenuItem>
                </MenuList>
              </Menu>
            </Flex>

            <Box overflowY="auto" px={1}>
              {searchType === "PROFILE" ? (
                <ProfileSearchSection query={query} setQuery={setQuery} onUserClick={handleUserClick} />
              ) : (
                <NftSearchSection />
              )}
            </Box>
          </Box>
        </Box>
      )}
    </AnimatePresence>
  )
}

export default SearchDrawer