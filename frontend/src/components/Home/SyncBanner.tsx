// src/components/Home/SyncBanner.tsx
import React from "react";
import { HStack, Text, Spinner, Box, Flex } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ApiSyncState } from "../../types/inventory";

export const SyncBanner: React.FC<{ state: ApiSyncState | null }> = ({ state }) => {
  if (!state || state.status === "COMPLETED") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
      >
        <Flex
          bg="rgba(232, 215, 253, 0.1)"
          border="1px solid"
          borderColor="brand.500"
          borderRadius="20px"
          p={4}
          mb={6}
          align="center"
          justify="space-between"
        >
          <HStack spacing={4}>
            <Spinner size="sm" color="brand.500" thickness="2px" />
            <Box>
              <Text fontSize="13px" fontWeight="900" color="white">
                СИНХРОНИЗАЦИЯ С TELEGRAM
              </Text>
              <Text fontSize="11px" fontWeight="700" color="whiteAlpha.600">
                Мы сканируем ваш инвентарь...
              </Text>
            </Box>
          </HStack>
          <Text fontSize="18px" fontWeight="900" color="brand.500">
            {state.totalItemsInTelegram || 0}
          </Text>
        </Flex>
      </motion.div>
    </AnimatePresence>
  );
};