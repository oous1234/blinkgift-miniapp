import React, { useState, useEffect, useCallback } from "react"
import { Box, Flex, Text, Button, HStack } from "@chakra-ui/react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { UserIcon, NftIcon } from "@components/Shared/Icons"
import { ProfileSearchSection } from "./ProfileSearchSection"
import { NftSearchSection } from "./NftSearchSection"

interface SearchDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const SearchDrawer: React.FC<SearchDrawerProps> = ({ isOpen, onClose }) => {
  const [searchType, setSearchType] = useState<"PROFILE" | "NFT">("PROFILE")
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handleUserClick = useCallback((user: any) => {
    onClose()
    navigate(`/user/${user.id}`, { state: {
      username: user.username,
      name: user.name,
      avatarUrl: user.username ? `https://poso.see.tg/api/avatar/${user.username}` : undefined
    }})
  }, [navigate, onClose])

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
            borderTopRadius="40px"
            p={6}
            pb="calc(20px + env(safe-area-inset-bottom))"
            display="flex"
            flexDirection="column"
          >
            <Box w="40px" h="4px" bg="whiteAlpha.200" borderRadius="full" mx="auto" mb={6} />

            <Flex mb={6} justify="space-between" align="center">
              <Text fontSize="24px" fontWeight="900">Поиск</Text>

              <HStack bg="whiteAlpha.100" p="4px" borderRadius="14px">
                <Button
                  size="sm"
                  variant="ghost"
                  borderRadius="10px"
                  bg={searchType === "PROFILE" ? "whiteAlpha.200" : "transparent"}
                  color={searchType === "PROFILE" ? "white" : "whiteAlpha.500"}
                  onClick={() => setSearchType("PROFILE")}
                  leftIcon={<UserIcon boxSize="14px" />}
                >
                  Люди
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  borderRadius="10px"
                  bg={searchType === "NFT" ? "whiteAlpha.200" : "transparent"}
                  color={searchType === "NFT" ? "white" : "whiteAlpha.500"}
                  onClick={() => setSearchType("NFT")}
                  leftIcon={<NftIcon boxSize="14px" />}
                >
                  NFT
                </Button>
              </HStack>
            </Flex>

            <Box overflowY="auto" flex={1} px={1}>
              {searchType === "PROFILE" ? (
                <ProfileSearchSection onUserClick={handleUserClick} />
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