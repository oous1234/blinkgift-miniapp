// frontend/src/components/overlay/search/SearchDrawer.tsx
import React from "react";
import { Box, Flex, Button, HStack, Center, Spinner, Text, IconButton } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CloseIcon, ArrowBackIcon } from "@chakra-ui/icons";

// Компоненты разделов поиска
import { ProfileSearchSection } from "./ProfileSearchSection";
import { NftSearchSection } from "./NftSearchSection";
import { GiftDetailContent } from "../GiftDetail/GiftDetailContent";

// Логика и стейт
import { useSearchDrawerLogic } from "../../../hooks/useSearchDrawerLogic";

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchDrawer: React.FC<SearchDrawerProps> = ({ isOpen, onClose }) => {
  const logic = useSearchDrawerLogic(isOpen, onClose);
  const navigate = useNavigate();

  // Общий стиль для кнопок в "стеклянном" стиле (Glassmorphism)
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
          {/* Затемнение фона (Backdrop) */}
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

          {/* Тело шторки */}
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
            {/* Хедер управления */}
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
              {/* Левая кнопка: НАЗАД (если в деталях) или ЗАКРЫТЬ */}
              <Button
                {...glassStyle}
                leftIcon={logic.view === "DETAIL" ? <ArrowBackIcon /> : undefined}
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

              {/* Центральный переключатель: ПРОФИЛИ / МАРКЕТ (только в режиме списка) */}
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
                    bg={logic.searchType === "PROFILE" ? "whiteAlpha.300" : "transparent"}
                    color={logic.searchType === "PROFILE" ? "white" : "whiteAlpha.500"}
                    onClick={() => logic.setSearchType("PROFILE")}
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
                    bg={logic.searchType === "NFT" ? "whiteAlpha.300" : "transparent"}
                    color={logic.searchType === "NFT" ? "white" : "whiteAlpha.500"}
                    onClick={() => logic.setSearchType("NFT")}
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

            {/* Контентная область со скроллом */}
            <Box
              flex={1}
              overflowY="auto"
              px={5}
              pt="80px" // Отступ под хедер
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
                      /* Секция поиска пользователей */
                      <ProfileSearchSection
                        onSelect={(user) => {
                          // 1. Закрываем поиск
                          onClose();
                          // 2. Переходим на страницу выбранного пользователя
                          navigate(`/user/${user.id}`);
                        }}
                      />
                    ) : (
                      /* Секция поиска по атрибутам NFT */
                      <NftSearchSection onGiftClick={logic.handleOpenGift} />
                    )}
                  </motion.div>
                ) : (
                  /* Вид деталей конкретного подарка (открывается внутри поиска) */
                  <motion.div
                    key="detail"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    {logic.isLoadingDetail ? (
                      <Center h="40vh">
                        <Spinner color="brand.500" thickness="3px" size="xl" />
                      </Center>
                    ) : logic.selectedGift ? (
                      <GiftDetailContent
                        gift={logic.selectedGift}
                        // В этом компоненте мы передаем историю, если она нужна
                      />
                    ) : (
                      <Center h="40vh">
                        <Text>Не удалось загрузить данные</Text>
                      </Center>
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