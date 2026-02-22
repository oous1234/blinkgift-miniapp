// frontend/src/views/Home/index.tsx
import React, { useEffect, useState } from "react";
import { Box, SimpleGrid, Flex, Avatar, VStack, HStack, Text, Heading, Center, Skeleton, IconButton } from "@chakra-ui/react";
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
  const { id } = useParams<{ id: string }>(); // Получаем ID из URL
  const navigate = useNavigate();
  const { user: me, haptic } = useTelegram();

  // Загружаем портфель (свой или чужой)
  const { items, total, syncState, analytics, isLoading, isExternal } = usePortfolio(id);
  const { loadDetail } = useGiftDetail();

  // Состояние для отображения данных профиля (имя/аватар)
  const [profileInfo, setProfileInfo] = useState({
    name: me.first_name,
    photo: me.photo_url,
    username: me.username
  });

  // Если мы смотрим чужой профиль, пытаемся подтянуть данные из API или пропсов
  // В реальном приложении здесь должен быть вызов OwnerService.getProfile(id)
  useEffect(() => {
    if (isExternal && id) {
      // Имитация получения данных о пользователе.
      // В идеале данные должны приходить вместе с инвентарем или отдельным запросом.
      setProfileInfo({
        name: `User #${id.slice(-4)}`,
        photo: `https://poso.see.tg/api/avatar/${id}`, // Пример API аватарок
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
    loadDetail(item.slug, item.serialNumber);
  };

  return (
    <Box px={4} pt={2} pb="120px">
      {/* Кнопка "Назад", если мы смотрим не свой профиль */}
      {isExternal && (
        <HStack mb={4} onClick={() => navigate(-1)} cursor="pointer" color="brand.500">
          <ArrowBackIcon />
          <Text fontSize="14px" fontWeight="800">НАЗАД</Text>
        </HStack>
      )}

      <Flex align="center" mb={8} mt={isExternal ? 0 : 4}>
        <Avatar
          size="xl"
          src={profileInfo.photo}
          name={profileInfo.name}
          borderRadius="28px"
          mr={5}
          border="2px solid"
          borderColor={isExternal ? "brand.500" : "whiteAlpha.200"}
        />
        <VStack align="start" spacing={1}>
          <Text color="whiteAlpha.400" fontSize="10px" fontWeight="900" textTransform="uppercase" letterSpacing="1px">
            {isExternal ? "User Portfolio Value" : "My Portfolio Value"}
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

      {/* Синхронизацию показываем только в своем профиле */}
      {!isExternal && <SyncBanner state={syncState} />}

      <Box>
        <Heading size="xs" fontWeight="900" mb={5} color="whiteAlpha.500" letterSpacing="1px" textTransform="uppercase">
          {isExternal ? "User Inventory" : "My Inventory"}
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