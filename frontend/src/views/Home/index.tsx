// frontend/src/views/Home/index.tsx
import React, { useState } from "react"
import { Box, SimpleGrid, Flex, Spinner, Center, Text, Button } from "@chakra-ui/react"
import { useInventory } from "./hooks/useInventory"
import { useOwnerProfile } from "./hooks/useOwnerProfile" // Импортируем новый хук
import { NetWorthCard } from "@components/Home/NetWorthCard"
import { GiftCard } from "@components/Home/GiftCard"
import BottomNavigation from "@components/navigation/BottomNavigation"
import { Pagination } from "@components/Home/Pagination"

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"inventory" | "stats">("inventory")

  // 1. Получаем инвентарь (для списка подарков)
  const {
    items,
    totalCount,
    currentPage,
    limit,
    isError: isInventoryError,
    refetch: refetchInventory,
    setPage
  } = useInventory()

  // 2. Получаем данные владельца (для Net Worth и графиков)
  const {
    ownerData,
    isLoading: isOwnerLoading,
    isError: isOwnerError,
    refetch: refetchOwner
  } = useOwnerProfile()

  // Loading state (ждем, пока загрузится профиль, инвентарь может подгрузиться чуть позже или параллельно)
  if (isOwnerLoading) {
    return (
      <Center minH="100vh" bg="#0F1115" flexDirection="column" gap={4}>
        <Spinner size="xl" color="blue.400" thickness="4px" speed="0.65s" />
        <Text color="gray.500" fontSize="sm">
          Loading profile...
        </Text>
      </Center>
    )
  }

  // Error state
  if ((isInventoryError && items.length === 0) || isOwnerError) {
    return (
      <Center minH="100vh" bg="#0F1115" flexDirection="column" gap={4}>
        <Text color="red.400">Connection failed</Text>
        <Button
          onClick={() => { refetchInventory(); refetchOwner(); }}
          size="sm"
          colorScheme="blue"
          variant="outline"
        >
          Try Again
        </Button>
      </Center>
    )
  }

  // Данные для NetWorthCard берем из ответа /owner -> portfolio_value -> portals
  const portalsValue = ownerData?.portfolio_value?.portals?.ton || 0

  // Данные для графика лежат в ownerData?.portfolio_history (пока не рисуем, но они есть)
  // const historyData = ownerData?.portfolio_history

  // Пока бекенд не отдает PnL (profit/loss), ставим заглушки или считаем локально, если нужно.
  // Для примера оставим 0 или можно высчитывать разницу за 24ч из истории.
  const mockPnL = 0
  const mockPnLPercent = 0

  // Best performer можно оставить локальным из инвентаря, если бекенд его не дает
  // Или убрать, если не нужно. Для примера передадим заглушку.
  const bestPerformer = { name: "N/A", profit: 0 }

  return (
    <Box minH="100vh" bg="#0F1115" color="white" pb="100px" px="16px" pt="16px">
      <NetWorthCard
        totalValue={portalsValue} // <-- Значение с Portals
        totalPnL={mockPnL}
        pnlPercent={mockPnLPercent}
        bestPerformer={bestPerformer}
      />

      {/* Tabs */}
      <Flex
        bg="whiteAlpha.50"
        p="4px"
        borderRadius="14px"
        mb="24px"
        border="1px solid"
        borderColor="whiteAlpha.100"
      >
        <TabButton
          isActive={activeTab === "inventory"}
          onClick={() => setActiveTab("inventory")}
          label="Gifts"
          // Берем total либо из инвентаря, либо gifts_count из профиля
          badge={ownerData?.gifts_count || totalCount}
        />
        <TabButton
          isActive={activeTab === "stats"}
          onClick={() => setActiveTab("stats")}
          label="Analytics"
        />
      </Flex>

      {/* Content Area */}
      <Box animation="fadeIn 0.3s ease-in-out">
        {activeTab === "inventory" ? (
          <>
            {items.length === 0 ? (
              <Center py={20} flexDirection="column" opacity={0.6}>
                <Text fontSize="40px" mb={2}>
                  🎁
                </Text>
                <Text>No gifts found</Text>
              </Center>
            ) : (
              <Box>
                {/* Сетка товаров */}
                <SimpleGrid columns={2} spacing="12px" mb={4}>
                  <Box display="contents">
                    {items.map((item) => (
                      <GiftCard key={item.id} item={item} />
                    ))}
                  </Box>
                </SimpleGrid>

                {/* Пагинация */}
                <Pagination
                  currentPage={currentPage}
                  totalCount={totalCount}
                  pageSize={limit}
                  onPageChange={setPage}
                />
              </Box>
            )}
          </>
        ) : (
          // Передаем данные из профиля в статистику
          <StatisticsView
            totalValue={portalsValue}
            itemCount={ownerData?.gifts_count || 0}
          />
        )}
      </Box>

      <BottomNavigation />
    </Box>
  )
}

// ... TabButton остается без изменений ...
const TabButton = ({ isActive, onClick, label, badge }: any) => (
  <Box
    as="button"
    flex={1}
    py="10px"
    borderRadius="10px"
    bg={isActive ? "#1F232E" : "transparent"}
    color={isActive ? "white" : "gray.500"}
    fontWeight={isActive ? "600" : "500"}
    fontSize="14px"
    onClick={onClick}
    display="flex"
    alignItems="center"
    justifyContent="center"
    gap="6px"
    transition="all 0.2s"
  >
    {label}
    {badge > 0 && (
      <Box
        bg={isActive ? "whiteAlpha.300" : "whiteAlpha.100"}
        px="6px"
        borderRadius="4px"
        fontSize="11px"
      >
        {badge}
      </Box>
    )}
  </Box>
)

// Обновленный StatisticsView, принимающий простые пропсы
const StatisticsView = ({ totalValue, itemCount }: { totalValue: number, itemCount: number }) => (
  <Box bg="#161920" borderRadius="20px" p="20px" border="1px solid" borderColor="whiteAlpha.100">
    <Text fontSize="16px" fontWeight="700" mb="16px">
      Market Analysis
    </Text>
    {/* Тут можно будет добавить график, используя ownerData.portfolio_history */}

    <Flex direction="column" gap="0">
      <StatRow label="Est. Total Value" value={`${totalValue.toLocaleString()} TON`} highlight />
      <StatRow label="Items Count" value={itemCount} />
    </Flex>
  </Box>
)

const StatRow = ({ label, value, highlight }: any) => (
  <Flex
    justify="space-between"
    py="12px"
    borderBottom="1px solid"
    borderColor="whiteAlpha.50"
    _last={{ border: "none" }}
  >
    <Text color="gray.400" fontSize="13px">
      {label}
    </Text>
    <Text fontWeight="600" color={highlight ? "blue.400" : "white"}>
      {value}
    </Text>
  </Flex>
)

export default ProfilePage