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

  // Общий стиль для кнопок-контейнеров
  const glassStyle = {
    bg: "whiteAlpha.100",
    backdropFilter: "blur(12px)",
    border: "1px solid",
    borderColor: "whiteAlpha.100",
    borderRadius: "full",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Box position="fixed" inset={0} zIndex={2000}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(8px)"
            }}
            onClick={onClose}
          />

          {/* Drawer Body */}
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
            {/* Header - ПОЛНОСТЬЮ ПРОЗРАЧНЫЙ */}
            <Flex
              position="absolute"
              top="0"
              left="0"
              right="0"
              zIndex={100}
              px={4}
              h="70px"
              align="center"
              justify="space-between"
              bg="transparent"
            >
              {/* Кнопка НАЗАД / ЗАКРЫТЬ */}
              <Button
                {...glassStyle}
                leftIcon={<ArrowBackIcon boxSize="14px" />}
                h="36px"
                px={4}
                fontSize="11px"
                fontWeight="900"
                color="white"
                onClick={logic.handleBack}
                _active={{ transform: "scale(0.95)", bg: "whiteAlpha.200" }}
              >
                {logic.view === "DETAIL" ? "НАЗАД" : "ЗАКРЫТЬ"}
              </Button>

              {/* Переключатель ПРОФИЛИ / МАРКЕТ */}
              {logic.view === "LIST" && (
                <HStack
                  {...glassStyle}
                  h="38px"
                  p="3px"
                  spacing={0}
                >
                  <Button
                    h="30px"
                    px={4}
                    borderRadius="full"
                    fontSize="10px"
                    fontWeight="900"
                    transition="all 0.2s"
                    bg={logic.searchType === "PROFILE" ? "whiteAlpha.300" : "transparent"}
                    color={logic.searchType === "PROFILE" ? "white" : "whiteAlpha.500"}
                    onClick={() => logic.setSearchType("PROFILE")}
                    _hover={{}} // Убираем ховер
                    _active={{ transform: "scale(0.95)" }}
                  >
                    ПРОФИЛИ
                  </Button>
                  <Button
                    h="30px"
                    px={4}
                    borderRadius="full"
                    fontSize="10px"
                    fontWeight="900"
                    transition="all 0.2s"
                    bg={logic.searchType === "NFT" ? "whiteAlpha.300" : "transparent"}
                    color={logic.searchType === "NFT" ? "white" : "whiteAlpha.500"}
                    onClick={() => logic.setSearchType("NFT")}
                    _hover={{}}
                    _active={{ transform: "scale(0.95)" }}
                  >
                    МАРКЕТ
                  </Button>
                </HStack>
              )}

              {/* Кнопка закрытия (Крестик) */}
              <IconButton
                {...glassStyle}
                aria-label="close"
                icon={<CloseIcon boxSize="10px" />}
                h="36px"
                w="36px"
                minW="36px"
                color="white"
                onClick={onClose}
                _active={{ transform: "scale(0.95)", bg: "whiteAlpha.200" }}
              />
            </Flex>

            {/* Scrollable Content Area */}
            <Box
              flex={1}
              overflowY="auto"
              px={5}
              pt="80px"
              pb="100px"
              css={{
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              <AnimatePresence mode="wait">
                {logic.view === "LIST" ? (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {logic.searchType === "PROFILE" ? (
                      <ProfileSearchSection onSelect={(user) => { onClose(); navigate(`/user/${user.id}`); }} />
                    ) : (
                      <NftSearchSection onGiftClick={logic.handleOpenGift} />
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="detail"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
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