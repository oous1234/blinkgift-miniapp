import React, { useState, useEffect } from "react";
import { Box, Flex, Button, HStack, Center, Spinner, Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CloseIcon, ArrowBackIcon } from "@chakra-ui/icons";

import { ProfileSearchSection } from "./ProfileSearchSection";
import { NftSearchSection } from "./NftSearchSection";
import { GiftDetailContent } from "../GiftDetail/GiftDetailContent";
import { InventoryService } from "../../../services/inventory.service";
import { Gift } from "../../../types/domain";

const SearchDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [searchType, setSearchType] = useState<"PROFILE" | "NFT">("PROFILE");
  const [view, setView] = useState<"LIST" | "DETAIL">("LIST");

  // Состояние для детальной инфы подарка
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [giftHistory, setGiftHistory] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const navigate = useNavigate();

  // Сброс при закрытии
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setView("LIST");
        setSelectedGift(null);
        setGiftHistory([]);
      }, 300);
    }
  }, [isOpen]);

  // Функция открытия деталей (как было раньше, но на новых сервисах)
  const handleOpenGift = async (slug: string, num: number) => {
    setIsLoadingDetail(true);
    setView("DETAIL"); // Сразу переключаем вид на детали (там будет лоадер)

    try {
      // 1. Грузим основную информацию
      const giftData = await InventoryService.getGiftDetail(slug, num);
      setSelectedGift(giftData);

      // 2. Сразу же запрашиваем историю блокчейна
      setIsHistoryLoading(true);
      const historyData = await InventoryService.getBlockchainHistory(giftData.id);
      setGiftHistory(historyData.history || []);
    } catch (e) {
      console.error("Error loading gift detail:", e);
    } finally {
      setIsLoadingDetail(false);
      setIsHistoryLoading(false);
    }
  };

  const handleBack = () => {
    if (view === "DETAIL") {
      setView("LIST");
      setSelectedGift(null);
    } else {
      onClose();
    }
  };

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
            {/* Header */}
            <Flex position="absolute" top="0" left="0" right="0" zIndex={10} px={4} h="60px" align="center" justify="space-between">
              <Button
                leftIcon={<ArrowBackIcon />} size="sm" variant="ghost" bg="whiteAlpha.100" borderRadius="full"
                onClick={handleBack}
              >
                {view === "DETAIL" ? "НАЗАД" : "ЗАКРЫТЬ"}
              </Button>
              {view === "LIST" && (
                <HStack bg="whiteAlpha.50" p="4px" borderRadius="14px">
                  <Button size="xs" variant="ghost" bg={searchType === "PROFILE" ? "whiteAlpha.200" : "transparent"} onClick={() => setSearchType("PROFILE")}>ПРОФИЛИ</Button>
                  <Button size="xs" variant="ghost" bg={searchType === "NFT" ? "whiteAlpha.200" : "transparent"} onClick={() => setSearchType("NFT")}>МАРКЕТ</Button>
                </HStack>
              )}
              <IconButton aria-label="close" icon={<CloseIcon size="xs" />} size="sm" variant="ghost" onClick={onClose} />
            </Flex>

            {/* Content Area */}
            <Box flex={1} mt="60px" overflowY="auto" px={5} pb="100px">
              <AnimatePresence mode="wait">
                {view === "LIST" ? (
                  <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {searchType === "PROFILE" ? (
                      <ProfileSearchSection onSelect={(user) => { onClose(); navigate(`/user/${user.id}`); }} />
                    ) : (
                      <NftSearchSection onGiftClick={handleOpenGift} />
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="detail" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    {isLoadingDetail ? (
                      <Center h="40vh"><Spinner color="brand.500" thickness="3px" size="xl" /></Center>
                    ) : selectedGift ? (
                      <GiftDetailContent
                        gift={selectedGift}
                        history={giftHistory}
                        isHistoryLoading={isHistoryLoading}
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

import { IconButton } from "@chakra-ui/react";
export default SearchDrawer;