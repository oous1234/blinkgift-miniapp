import React from "react";
import { Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerCloseButton, Box, Center, Spinner, Text, Button } from "@chakra-ui/react";
import { useUIStore } from "../../store/useUIStore";
import { GiftDetailContent } from "./GiftDetail/GiftDetailContent";

// Пропсы больше не нужны, всё берем из глобального стейта или передаем через контекст
// Но в данном случае лучше передавать gift и history из родителя (MainLayout),
// где работает хук useGiftDetail.

interface Props {
  gift: any;
  history: any[];
  isLoading: boolean;
  isHistoryLoading: boolean;
}

const GiftDetailDrawer: React.FC<Props> = ({ gift, history, isLoading, isHistoryLoading }) => {
  const { isDetailOpen, closeDetail } = useUIStore();

  return (
    <Drawer isOpen={isDetailOpen} placement="bottom" onClose={closeDetail}>
      <DrawerOverlay backdropFilter="blur(20px)" bg="blackAlpha.800" />
      <DrawerContent borderTopRadius="36px" bg="#0F1115" color="white" maxH="90vh">
        <Box w="40px" h="5px" bg="whiteAlpha.200" borderRadius="full" mx="auto" mt={4} mb={2} />
        <DrawerCloseButton color="whiteAlpha.400" />
        <DrawerBody px={6} pt={2} pb={10}>
          {isLoading ? (
            <Center h="300px"><Spinner color="brand.500" /></Center>
          ) : gift ? (
            <>
              <GiftDetailContent gift={gift} history={history} isHistoryLoading={isHistoryLoading} />
              <Button
                mt={6} w="100%" h="56px" bg="#0088CC" color="white" borderRadius="20px" fontWeight="900"
                onClick={() => window.Telegram?.WebApp?.openLink(`https://fragment.com/gift/${gift.slug}-${gift.number}`)}
              >
                ОТКРЫТЬ НА FRAGMENT
              </Button>
            </>
          ) : (
            <Center h="200px"><Text>Ошибка загрузки данных</Text></Center>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default GiftDetailDrawer;