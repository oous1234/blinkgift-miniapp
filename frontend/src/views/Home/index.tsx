import React from "react"
import { Box, SimpleGrid, Flex, Avatar, VStack, HStack, Text, Heading } from "@chakra-ui/react"
import { usePortfolio } from "../../hooks/usePortfolio"
import { useUIStore } from "../../store/useUIStore"
import { useGiftDetail } from "../../hooks/useGiftDetail"
import { GiftCard } from "../../components/Home/GiftCard"
import { Pagination } from "../../components/Home/Pagination"
import { TonValue } from "../../components/Shared/TonValue"
import { TrendBadge } from "../../components/Shared/TrendBadge"
import GiftDetailDrawer from "../../components/overlay/GiftDetailDrawer"

const HomeView: React.FC = () => {
  const { items, total, page, setPage, analytics, isLoading } = usePortfolio()
  const { gift, history, isHistoryLoading, loadDetail, reset } = useGiftDetail()
  const { isDetailOpen, openDetail, closeDetail } = useUIStore()

  const handleGiftClick = (item: any) => {
    haptic.impact('light')
    loadDetail(item.slug, item.number)
    openDetail()
  }

  return (
    <Box px={4} pt={2} pb="100px">
      <Flex align="center" mb={8}>
        <Avatar
          size="xl"
          src={window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url}
          borderRadius="24px"
          mr={5}
        />
        <VStack align="start" spacing={1}>
          <Text color="whiteAlpha.400" fontSize="10px" fontWeight="900" textTransform="uppercase">
            Portfolio Value
          </Text>
          <TonValue value={analytics.current.toFixed(2)} fontSize="32px" iconSize="20px" />
          <HStack spacing={3}>
            <TrendBadge value={analytics.percent.toFixed(1)} />
            <Text fontSize="13px" fontWeight="800" color="whiteAlpha.700">
              {total} items
            </Text>
          </HStack>
        </VStack>
      </Flex>

      <Box mb={4}>
        <Heading size="sm" fontWeight="900" mb={4}>INVENTORY</Heading>
        <SimpleGrid columns={2} spacing={3}>
          {items.map((item) => (
            <GiftCard
              key={item.id}
              item={item as any}
              onClick={() => handleGiftClick(item)}
            />
          ))}
        </SimpleGrid>
      </Box>

      <Pagination
        currentPage={page}
        totalCount={total}
        pageSize={10}
        onPageChange={setPage}
      />

      <GiftDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => { closeDetail(); reset(); }}
        gift={gift}
        historyData={history}
        isHistoryLoading={isHistoryLoading}
      />
    </Box>
  )
}

export default HomeView