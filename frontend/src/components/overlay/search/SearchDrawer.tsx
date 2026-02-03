import React, { useState, useEffect } from "react"
import { Box, Flex, Text, IconButton, HStack, Button } from "@chakra-ui/react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { CloseIcon, ArrowBackIcon } from "@chakra-ui/icons"
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

  // Состояния для NFT поиска
  const [nftForm, setNftForm] = useState({
    gift: "Все подарки",
    model: "Любая модель",
    pattern: "Любой узор",
    backdropObj: null as any,
    number: "",
    sortBy: "newest",
  })
  const [nftResults, setNftResults] = useState<any[]>([])
  const [nftTotal, setNftTotal] = useState(0)
  const [nftPage, setNftPage] = useState(1)
  const [nftHasSearched, setNftHasSearched] = useState(false)
  const [profileQuery, setProfileQuery] = useState("")

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
    } catch (e) { console.error(e) } finally { setIsLoadingDetail(false) }
  }

  const handleBack = () => {
    if (view === "DETAIL") setView("LIST")
    else onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Box position="fixed" inset={0} zIndex={2000}>
          {/* Backdrop / Затемнение фона */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
            }}
            onClick={onClose}
          />

          {/* Само окно (Drawer) */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "85vh",
              backgroundColor: "#0F1115",
              borderTopLeftRadius: "30px",
              borderTopRightRadius: "30px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 -20px 50px rgba(0,0,0,0.5)",
              overflow: "hidden"
            }}
          >
            {/* Liquid Glass Header / Шапка "Жидкое стекло" */}
            <Flex
              position="absolute"
              top="0"
              left="0"
              right="0"
              zIndex={10}
              px={5}
              h="70px"
              align="center"
              justify="space-between"
              background="rgba(20, 22, 28, 0.6)" // Прозрачность
              backdropFilter="blur(25px) saturate(180%)" // Эффект стекла
              borderBottom="1px solid rgba(255,255,255,0.08)"
            >
              <IconButton
                aria-label="Back"
                icon={view === "DETAIL" ? <ArrowBackIcon /> : <CloseIcon fontSize="10px" />}
                size="md"
                variant="ghost"
                bg="whiteAlpha.100"
                _active={{ bg: "whiteAlpha.300", transform: "scale(0.9)" }}
                borderRadius="full"
                onClick={handleBack}
              />

              <Text fontSize="17px" fontWeight="900" letterSpacing="-0.5px">
                {view === "DETAIL" ? "Информация" : "Поиск"}
              </Text>

              {/* Пустой блок для симметрии или доп. кнопка */}
              <Box w="40px" />
            </Flex>

            {/* Scrollable Content Area */}
            <Box
              flex={1}
              mt="70px" // Отступ под высоту шапки
              overflowY="auto"
              px={5}
              pb="calc(40px + env(safe-area-inset-bottom))" // Учет нижней безопасной зоны
              css={{
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              <AnimatePresence mode="wait">
                {view === "LIST" ? (
                  <motion.div
                    key="list-screen"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                  >
                    <Flex mb={6} mt={4} justify="center">
                      <HStack bg="whiteAlpha.50" p="4px" borderRadius="16px" w="full">
                        <Button
                          flex={1} size="sm" variant="ghost" fontSize="11px" fontWeight="900"
                          bg={searchType === "PROFILE" ? "whiteAlpha.200" : "transparent"}
                          color={searchType === "PROFILE" ? "white" : "whiteAlpha.400"}
                          onClick={() => setSearchType("PROFILE")}
                        >
                          ПРОФИЛИ
                        </Button>
                        <Button
                          flex={1} size="sm" variant="ghost" fontSize="11px" fontWeight="900"
                          bg={searchType === "NFT" ? "whiteAlpha.200" : "transparent"}
                          color={searchType === "NFT" ? "white" : "whiteAlpha.400"}
                          onClick={() => setSearchType("NFT")}
                        >
                          МАРКЕТПЛЕЙС
                        </Button>
                      </HStack>
                    </Flex>

                    {searchType === "PROFILE" ? (
                      <ProfileSearchSection
                        query={profileQuery}
                        setQuery={setProfileQuery}
                        onUserClick={(user) => { onClose(); navigate(`/user/${user.id}`) }}
                      />
                    ) : (
                      <NftSearchSection
                        onGiftClick={handleOpenGift}
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
                  </motion.div>
                ) : (
                  <motion.div
                    key="detail-screen"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <GiftDetailContent
                      gift={selectedGift}
                      isLoading={isLoadingDetail}
                      isError={false}
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