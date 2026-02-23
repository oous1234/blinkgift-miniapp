import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Center,
  Spinner,
  Text,
  Button,
  VStack
} from "@chakra-ui/react";
import { useUIStore } from "../../store/useUIStore";
import { GiftDetailContent } from "./GiftDetail/GiftDetailContent";

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
            <Center h="400px">
              <VStack spacing={4}>
                <Spinner color="brand.500" size="xl" thickness="4px" />
                <Text fontSize="12px" fontWeight="800" color="whiteAlpha.400">ЗАГРУЗКА ДАННЫХ...</Text>
              </VStack>
            </Center>
          ) : gift ? (
            <>
              <GiftDetailContent gift={gift} />
              <Button
                mt={6}
                w="100%"
                h="56px"
                bg="#0088CC"
                color="white"
                borderRadius="20px"
                fontWeight="900"
                _active={{ transform: "scale(0.98)" }}
                onClick={() => window.Telegram?.WebApp?.openLink(`https://fragment.com/gift/${gift.slug.toLowerCase()}`)}
              >
                ОТКРЫТЬ НА FRAGMENT
              </Button>
            </>
          ) : (
            <Center h="300px">
              <VStack spacing={4}>
                <Text color="whiteAlpha.600" fontWeight="700">Не удалось получить детали объекта</Text>
                <Button
                  variant="outline"
                  borderColor="whiteAlpha.200"
                  color="white"
                  size="sm"
                  borderRadius="12px"
                  onClick={closeDetail}
                >
                  ЗАКРЫТЬ
                </Button>
              </VStack>
            </Center>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default GiftDetailDrawer;