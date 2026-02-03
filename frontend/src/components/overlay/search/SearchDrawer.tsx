import React, { useState, useEffect } from "react"
import { Box, Flex, Text, Button, HStack } from "@chakra-ui/react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { UserIcon, NftIcon } from "@components/Shared/Icons"
import { ProfileSearchSection } from "./ProfileSearchSection"
import { NftSearchSection } from "./NftSearchSection"
import { GiftDetailContent } from "../GiftDetailContent"
import { GiftItem } from "../../../types/inventory"
import InventoryService from "../../../services/inventory"
import { ApiBackdrop } from "@services/changes"

const INITIAL_NFT_FORM = {
  gift: "Все подарки",
  model: "Любая модель",
  pattern: "Любой узор",
  backdropObj: null as ApiBackdrop | null,
  number: "",
  sortBy: "newest",
}

const SearchDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [searchType, setSearchType] = useState<"PROFILE" | "NFT">("PROFILE")
  const [view, setView] = useState<"LIST" | "DETAIL">("LIST")
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const navigate = useNavigate()

  // --- Состояние для сохранения данных поиска NFT ---
  const [nftForm, setNftForm] = useState(INITIAL_NFT_FORM)
  const [nftResults, setNftResults] = useState<any[]>([])
  const [nftTotal, setNftTotal] = useState(0)
  const [nftPage, setNftPage] = useState(1)
  const [nftHasSearched, setNftHasSearched] = useState(false)

  // --- Состояние для сохранения поиска людей ---
  const [profileQuery, setProfileQuery] = useState("")

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setView("LIST")
        setSelectedGift(null)
        // Если хотите полностью сбрасывать поиск при закрытии всего окна,
        // можно раскомментировать строки ниже:
        // setNftForm(INITIAL_NFT_FORM);
        // setNftResults([]);
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

  const tweenTransition = {
    type: "tween",
    ease: [0.25, 0.1, 0.25, 1],
    duration: 0.25,
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Box position="fixed" inset={0} zIndex={2000}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(15px)",
            }}
            onClick={onClose}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={tweenTransition}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "90vh",
              backgroundColor: "#0F1115",
              borderTopLeftRadius: "40px",
              borderTopRightRadius: "40px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box w="40px" h="4px" bg="whiteAlpha.200" borderRadius="full" mx="auto" mb={6} />

            <Box position="relative" flex={1} width="100%" overflow="hidden">
              <AnimatePresence initial={false} mode="popLayout">
                {view === "LIST" ? (
                  <motion.div
                    key="list"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={tweenTransition}
                    style={{ height: "100%", display: "flex", flexDirection: "column", width: "100%" }}
                  >
                    <Flex mb={6} justify="space-between" align="center">
                      <Text fontSize="24px" fontWeight="900">Поиск</Text>
                      <HStack bg="whiteAlpha.100" p="4px" borderRadius="14px">
                        <Button
                          size="sm"
                          variant="ghost"
                          bg={searchType === "PROFILE" ? "whiteAlpha.200" : "transparent"}
                          onClick={() => setSearchType("PROFILE")}
                        >
                          Люди
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          bg={searchType === "NFT" ? "whiteAlpha.200" : "transparent"}
                          onClick={() => setSearchType("NFT")}
                        >
                          NFT
                        </Button>
                      </HStack>
                    </Flex>

                    <Box overflowY="auto" flex={1} css={{ "&::-webkit-scrollbar": { display: "none" } }}>
                      {searchType === "PROFILE" ? (
                        <ProfileSearchSection
                          query={profileQuery}
                          setQuery={setProfileQuery}
                          onUserClick={(user) => { onClose(); navigate(`/user/${user.id}`) }}
                        />
                      ) : (
                        <NftSearchSection
                          onGiftClick={handleOpenGift}
                          // Передаем состояние как пропсы
                          persistentForm={nftForm}
                          setPersistentForm={setNftForm}
                          persistentResults={nftResults}
                          setPersistentResults={setNftResults}
                          persistentTotal={nftTotal}
                          setPersistentTotal={setNftTotal}
                          persistentPage={nftPage}
                          setPersistentPage={setNftPage}
                          persistentHasSearched={nftHasSearched}
                          setPersistentHasSearched={setNftHasSearched}
                        />
                      )}
                    </Box>
                  </motion.div>
                ) : (
                  <motion.div
                    key="detail"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={tweenTransition}
                    style={{ height: "100%", width: "100%", overflowY: "auto" }}
                  >
                    <GiftDetailContent
                      gift={selectedGift}
                      isLoading={isLoadingDetail}
                      isError={false}
                      onBack={() => setView("LIST")}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  )
}

export default SearchDrawer