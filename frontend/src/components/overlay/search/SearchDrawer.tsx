import React, { useState, useEffect, useCallback } from "react"
import { Box, Flex, Text, Button, HStack } from "@chakra-ui/react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { UserIcon, NftIcon } from "@components/Shared/Icons"
import { ProfileSearchSection } from "./ProfileSearchSection"
import { NftSearchSection } from "./NftSearchSection"
import { GiftDetailContent } from "../GiftDetailContent"
import { GiftItem } from "../../../types/inventory"
import InventoryService from "../../../services/inventory"

const SearchDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [searchType, setSearchType] = useState<"PROFILE" | "NFT">("PROFILE")
  const [view, setView] = useState<"LIST" | "DETAIL">("LIST")
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setView("LIST")
        setSelectedGift(null)
      }, 300)
    }
  }, [isOpen])

  const handleOpenGift = async (slug: string, num: number) => {
    setIsLoadingDetail(true)
    setView("DETAIL")
    try {
      const data = await InventoryService.getGiftDetail(slug, num)
      setSelectedGift(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoadingDetail(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Box position="fixed" inset={0} zIndex={2000}>
          <Box as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               position="absolute" inset={0} bg="blackAlpha.800" backdropFilter="blur(15px)" onClick={onClose} />

          <Box
            as={motion.div}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            position="absolute"
            bottom={0} left={0} right={0}
            height="90vh" bg="#0F1115" borderTopRadius="40px"
            p={6} pb="env(safe-area-inset-bottom)"
            display="flex" flexDirection="column"
          >
            <Box w="40px" h="4px" bg="whiteAlpha.200" borderRadius="full" mx="auto" mb={6} flexShrink={0} />

            <Box position="relative" flex={1} width="100%" overflow="hidden">
              <AnimatePresence initial={false} mode="popLayout">
                {view === "LIST" ? (
                  <Box
                    as={motion.div}
                    key="list"
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.4 }}
                    height="100%"
                    display="flex"
                    flexDirection="column"
                  >
                    <Flex mb={6} justify="space-between" align="center" flexShrink={0}>
                      <Text fontSize="24px" fontWeight="900">Поиск</Text>
                      <HStack bg="whiteAlpha.100" p="4px" borderRadius="14px">
                        <Button size="sm" variant="ghost" borderRadius="10px"
                          bg={searchType === "PROFILE" ? "whiteAlpha.200" : "transparent"}
                          color={searchType === "PROFILE" ? "white" : "whiteAlpha.500"}
                          onClick={() => setSearchType("PROFILE")} leftIcon={<UserIcon boxSize="14px" />}>Люди</Button>
                        <Button size="sm" variant="ghost" borderRadius="10px"
                          bg={searchType === "NFT" ? "whiteAlpha.200" : "transparent"}
                          color={searchType === "NFT" ? "white" : "whiteAlpha.500"}
                          onClick={() => setSearchType("NFT")} leftIcon={<NftIcon boxSize="14px" />}>NFT</Button>
                      </HStack>
                    </Flex>

                    <Box overflowY="auto" flex={1} pr={1} css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
                      {searchType === "PROFILE" ? (
                        <ProfileSearchSection onUserClick={(user) => { onClose(); navigate(`/user/${user.id}`) }} />
                      ) : (
                        <NftSearchSection onGiftClick={handleOpenGift} />
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Box
                    as={motion.div}
                    key="detail"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.4 }}
                    height="100%"
                    overflowY="auto"
                    pr={1}
                    css={{ '&::-webkit-scrollbar': { display: 'none' } }}
                  >
                    <GiftDetailContent
                      gift={selectedGift}
                      isLoading={isLoadingDetail}
                      isError={false}
                      onBack={() => setView("LIST")}
                    />
                  </Box>
                )}
              </AnimatePresence>
            </Box>
          </Box>
        </Box>
      )}
    </AnimatePresence>
  )
}
export default SearchDrawer