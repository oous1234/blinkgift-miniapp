import React from "react";
import { Box, Flex, Button, HStack, Center, Spinner, Text, IconButton } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CloseIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { ProfileSearchSection } from "./ProfileSearchSection";
import { NftSearchSection } from "./NftSearchSection";
import { GiftDetailContent } from "../GiftDetail/GiftDetailContent";
import { useSearchDrawerLogic } from "../../../hooks/useSearchDrawerLogic";

const SearchDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const logic = useSearchDrawerLogic(isOpen, onClose);
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <Box position="fixed" inset={0} zIndex={2000}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "83vh",
              backgroundColor: "#0F1115", borderTopLeftRadius: "30px", borderTopRightRadius: "30px",
              display: "flex", flexDirection: "column", boxShadow: "0 -20px 50px rgba(0,0,0,0.5)", overflow: "hidden"
            }}
          >
            <Flex position="absolute" top="0" left="0" right="0" zIndex={10} px={4} h="60px" align="center" justify="space-between">
              <Button
                leftIcon={<ArrowBackIcon />} size="sm" variant="solid" bg="whiteAlpha.100" borderRadius="full"
                onClick={logic.handleBack}
              >
                {logic.view === "DETAIL" ? "НАЗАД" : "ЗАКРЫТЬ"}
              </Button>

              {logic.view === "LIST" && (
                <HStack bg="whiteAlpha.50" p="4px" borderRadius="14px">
                  <Button
                    size="xs" variant="ghost"
                    bg={logic.searchType === "PROFILE" ? "whiteAlpha.200" : "transparent"}
                    onClick={() => logic.setSearchType("PROFILE")}
                  >
                    ПРОФИЛИ
                  </Button>
                  <Button
                    size="xs" variant="ghost"
                    bg={logic.searchType === "NFT" ? "whiteAlpha.200" : "transparent"}
                    onClick={() => logic.setSearchType("NFT")}
                  >
                    МАРКЕТ
                  </Button>
                </HStack>
              )}

              <IconButton
                aria-label="close" icon={<CloseIcon size="xs" />}
                size="sm" variant="ghost" onClick={onClose}
              />
            </Flex>

            <Box flex={1} mt="60px" overflowY="auto" px={5} pb="100px">
              <AnimatePresence mode="wait">
                {logic.view === "LIST" ? (
                  <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {logic.searchType === "PROFILE" ? (
                      <ProfileSearchSection onSelect={(user) => { onClose(); navigate(`/user/${user.id}`); }} />
                    ) : (
                      <NftSearchSection onGiftClick={logic.handleOpenGift} />
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="detail" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    {logic.isLoadingDetail ? (
                      <Center h="40vh"><Spinner color="brand.500" thickness="3px" size="xl" /></Center>
                    ) : logic.selectedGift ? (
                      <GiftDetailContent
                        gift={logic.selectedGift}
                        history={logic.giftHistory}
                        isHistoryLoading={logic.isHistoryLoading}
                      />
                    ) : (
                      <Center h="40vh"><Text>Не удалось загрузить данные</Text></Center>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default SearchDrawer;