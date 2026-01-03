// frontend/src/views/Home/index.tsx
import React, { useState } from "react"
import { Box, SimpleGrid, Flex, Spinner, Center, Text, Button } from "@chakra-ui/react"
import { useInventory } from "./hooks/useInventory"
import { useProfileAnalytics } from "./hooks/useProfileAnalytics"
import { NetWorthCard } from "@components/Home/NetWorthCard"
import { GiftCard } from "@components/Home/GiftCard"
import BottomNavigation from "@components/navigation/BottomNavigation"
import { Pagination } from "@components/Home/Pagination" // Импорт нового компонента

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"inventory" | "stats">("inventory")

  // Получаем данные и управление пагинацией
  const { items, totalCount, currentPage, limit, offset, isLoading, isError, refetch, setPage } =
    useInventory()

  const analytics = useProfileAnalytics(items)

  // Loading state
  if (isLoading && items.length === 0) {
    // Показываем спиннер только при первой загрузке или смене страниц, если данных нет
    return (
      <Center minH="100vh" bg="#0F1115" flexDirection="column" gap={4}>
        <Spinner size="xl" color="blue.400" thickness="4px" speed="0.65s" />
        <Text color="gray.500" fontSize="sm">
          Loading assets...
        </Text>
      </Center>
    )
  }

  // Error state
  if (isError && items.length === 0) {
    return (
      <Center minH="100vh" bg="#0F1115" flexDirection="column" gap={4}>
        <Text color="red.400">Connection failed</Text>
        <Button onClick={refetch} size="sm" colorScheme="blue" variant="outline">
          Try Again
        </Button>
      </Center>
    )
  }

  return (
    <Box minH="100vh" bg="#0F1115" color="white" pb="100px" px="16px" pt="16px">
      <NetWorthCard {...analytics} />

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
          badge={totalCount > 0 ? totalCount : items.length} // Показываем общий тотал если есть
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
                  {/* Прозрачность при подгрузке новой страницы, но контент остается */}
                  <Box display="contents" opacity={isLoading ? 0.5 : 1} transition="opacity 0.2s">
                    {items.map((item) => (
                      <GiftCard key={item.id} item={item} />
                    ))}
                  </Box>
                </SimpleGrid>

                {/* Компонент Пагинации */}
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
          <StatisticsView analytics={analytics} />
        )}
      </Box>

      <BottomNavigation />
    </Box>
  )
}

// ... TabButton, StatisticsView, StatRow (остаются без изменений)
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

const StatisticsView = ({ analytics }: { analytics: any }) => (
  <Box bg="#161920" borderRadius="20px" p="20px" border="1px solid" borderColor="whiteAlpha.100">
    <Text fontSize="16px" fontWeight="700" mb="16px">
      Market Analysis
    </Text>
    <Flex direction="column" gap="0">
      <StatRow label="Est. Total Value" value={`${analytics.totalValue || 0} TON`} highlight />
      <StatRow label="Items Count" value={analytics.itemCount} />
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
