import React from "react";
import { Box, SimpleGrid, Flex, Avatar, VStack, HStack, Text, Heading, Center, Spinner } from "@chakra-ui/react";
import { usePortfolio } from "../../hooks/usePortfolio";
import { useGiftDetail } from "../../hooks/useGiftDetail";
import { useTelegram } from "../../contexts/telegramContext";
import { GiftCard } from "../../components/Home/GiftCard";
import { Pagination } from "../../components/Home/Pagination";
import { TonValue, TrendBadge } from "../../components/shared/Typography";

const HomeView: React.FC = () => {
  const { user, haptic } = useTelegram();
  const { items, total, page, setPage, analytics, isLoading } = usePortfolio();
  const { loadDetail } = useGiftDetail();

  const handleGiftClick = (item: any) => {
    haptic.selection();
    loadDetail(item.slug, item.number);
  };

  if (isLoading && page === 1) {
    return (
      <Center h="80vh">
        <Spinner color="brand.500" thickness="3px" size="xl" />
      </Center>
    );
  }

  return (
    <Box px={4} pt={2} pb="100px">
      {/* Header Section */}
      <Flex align="center" mb={8}>
        <Avatar
          size="xl"
          src={user.photo_url}
          name={user.first_name}
          borderRadius="24px"
          mr={5}
          border="2px solid"
          borderColor="whiteAlpha.200"
        />
        <VStack align="start" spacing={1}>
          <Text color="whiteAlpha.400" fontSize="10px" fontWeight="900" textTransform="uppercase" letterSpacing="1px">
            Portfolio Value
          </Text>
          <TonValue value={analytics.current.toFixed(2)} size="lg" />
          <HStack spacing={3}>
            <TrendBadge value={analytics.percent} />
            <Text fontSize="13px" fontWeight="800" color="whiteAlpha.700">
              {total} items
            </Text>
          </HStack>
        </VStack>
      </Flex>

      {/* Inventory Grid */}
      <Box mb={4}>
        <Heading size="sm" fontWeight="900" mb={4} color="whiteAlpha.900">
          INVENTORY
        </Heading>
        {items.length > 0 ? (
          <SimpleGrid columns={2} spacing={3}>
            {items.map((item) => (
              <GiftCard
                key={item.id}
                item={item as any}
                onClick={() => handleGiftClick(item)}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Center py={10} bg="whiteAlpha.50" borderRadius="24px">
            <Text color="whiteAlpha.400" fontWeight="700">No gifts found</Text>
          </Center>
        )}
      </Box>

      <Pagination
        currentPage={page}
        totalCount={total}
        pageSize={10}
        onPageChange={setPage}
      />
    </Box>
  );
};

export default HomeView;