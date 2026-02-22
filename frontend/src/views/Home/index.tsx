// src/views/Home/index.tsx
import React from "react";
import { Box, SimpleGrid, Flex, Avatar, VStack, HStack, Text, Heading, Center, Skeleton } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { usePortfolio } from "../../hooks/usePortfolio";
import { useGiftDetail } from "../../hooks/useGiftDetail";
import { useTelegram } from "../../contexts/telegramContext";
import { GiftCard } from "../../components/Home/GiftCard";
import { SyncBanner } from "../../components/Home/SyncBanner";
import { TonValue } from "../../components/Shared/Typography";

const HomeView: React.FC = () => {
  const { user, haptic } = useTelegram();
  const { items, total, syncState, analytics, isLoading } = usePortfolio();
  const { loadDetail } = useGiftDetail();

  const handleGiftClick = (item: any) => {
    haptic.selection();
    loadDetail(item.slug, item.serialNumber);
  };

  return (
    <Box px={4} pt={2} pb="120px">
      <Flex align="center" mb={8} mt={4}>
        <Avatar
          size="xl"
          src={user.photo_url}
          name={user.first_name}
          borderRadius="28px"
          mr={5}
          border="2px solid"
          borderColor="whiteAlpha.200"
        />
        <VStack align="start" spacing={1}>
          <Text color="whiteAlpha.400" fontSize="10px" fontWeight="900" textTransform="uppercase" letterSpacing="1px">
            Portfolio Value
          </Text>
          <Skeleton isLoaded={!isLoading} borderRadius="8px">
            <TonValue value={analytics.current.toFixed(2)} size="lg" />
          </Skeleton>
          <HStack spacing={3}>
             <Text fontSize="13px" fontWeight="800" color="whiteAlpha.700">
              {total} objects found
            </Text>
          </HStack>
        </VStack>
      </Flex>

      <SyncBanner state={syncState} />

      <Box>
        <Heading size="xs" fontWeight="900" mb={5} color="whiteAlpha.500" letterSpacing="1px" textTransform="uppercase">
          Inventory
        </Heading>

        <SimpleGrid columns={2} spacing={3}>
          {isLoading && items.length === 0 ? (
            Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} height="180px" borderRadius="24px" />
            ))
          ) : (
            items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <GiftCard
                  item={{
                    ...item,
                    num: item.serialNumber,
                  } as any}
                  onClick={() => handleGiftClick(item)}
                />
              </motion.div>
            ))
          )}
        </SimpleGrid>

        {!isLoading && items.length === 0 && (
          <Center py={20} flexDirection="column">
            <Text color="whiteAlpha.200" fontWeight="900" fontSize="12px">NO GIFTS VISIBLE</Text>
          </Center>
        )}
      </Box>
    </Box>
  );
};

export default HomeView;