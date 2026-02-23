import React, { useEffect, useState } from "react";
import { Box, SimpleGrid, Flex, Avatar, VStack, HStack, Text, Heading, Center, Skeleton } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { usePortfolio } from "../../hooks/usePortfolio";
import { useGiftDetail } from "../../hooks/useGiftDetail";
import { useTelegram } from "../../contexts/telegramContext";
import { GiftCard } from "../../components/Home/GiftCard";
import { SyncBanner } from "../../components/Home/SyncBanner";
import { TonValue } from "../../components/Shared/Typography";
import { ArrowBackIcon } from "@chakra-ui/icons";

const HomeView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: me, haptic } = useTelegram();
  const { items, total, syncState, analytics, isLoading, isExternal } = usePortfolio(id);
  const { loadDetail } = useGiftDetail();

  const [profileInfo, setProfileInfo] = useState({
    name: me.first_name,
    photo: me.photo_url,
    username: me.username
  });

  useEffect(() => {
    if (isExternal && id) {
      setProfileInfo({
        name: `User #${id.slice(-4)}`,
        photo: `https://poso.see.tg/api/avatar/${id}`,
        username: undefined
      });
    } else {
      setProfileInfo({
        name: me.first_name,
        photo: me.photo_url,
        username: me.username
      });
    }
  }, [id, isExternal, me]);

  const handleGiftClick = (item: any) => {
    haptic.selection();
    // Теперь мы уверены, что в item.slug лежит правильная строка (напр. TrappedHeart-6709)
    loadDetail(item.slug || item.id);
  };

  return (
    <Box px={4} pt={2} pb="120px">
      {isExternal && (
        <HStack mb={6} onClick={() => navigate(-1)} cursor="pointer" color="brand.500">
          <ArrowBackIcon />
          <Text fontSize="14px" fontWeight="800">BACK</Text>
        </HStack>
      )}

      <Flex align="center" mb={10} mt={isExternal ? 0 : 4}>
        <Avatar
          size="xl"
          src={profileInfo.photo}
          name={profileInfo.name}
          borderRadius="28px"
          mr={5}
          border="2px solid"
          borderColor="whiteAlpha.100"
        />
        <VStack align="start" spacing={1}>
          <Text color="whiteAlpha.400" fontSize="10px" fontWeight="900" textTransform="uppercase">
            Portfolio Value
          </Text>
          <Skeleton isLoaded={!isLoading} borderRadius="8px">
            <TonValue value={analytics.current.toFixed(2)} size="lg" />
          </Skeleton>
          <Text fontSize="12px" fontWeight="800" color="brand.500">
            {total} COLLECTIBLES
          </Text>
        </VStack>
      </Flex>

      {!isExternal && <SyncBanner state={syncState} />}

      <Box>
        <Heading size="xs" fontWeight="900" mb={6} color="whiteAlpha.400" textTransform="uppercase" letterSpacing="1px">
          Inventory
        </Heading>

        <SimpleGrid minChildWidth="160px" spacing={4}>
          {isLoading && items.length === 0 ? (
            Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} height="180px" borderRadius="24px" />
            ))
          ) : (
            items.map((item, idx) => (
              <motion.div
                key={item.id || item.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <GiftCard
                  item={{
                    ...item,
                    num: item.number || item.serialNumber,
                  } as any}
                  onClick={() => handleGiftClick(item)}
                />
              </motion.div>
            ))
          )}
        </SimpleGrid>

        {!isLoading && items.length === 0 && (
          <Center py={20}>
            <Text color="whiteAlpha.200" fontWeight="900" fontSize="12px">EMPTY</Text>
          </Center>
        )}
      </Box>
    </Box>
  );
};

export default HomeView;