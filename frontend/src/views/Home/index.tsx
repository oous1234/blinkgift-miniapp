import React, { useState } from "react"
import { Box, SimpleGrid, Flex, Spinner, Center, Text, Button } from "@chakra-ui/react"
// 1. Импортируем наш новый хук
import { useInventory } from "./hooks/useInventory"
import { useProfileAnalytics } from "./hooks/useProfileAnalytics"
// Компоненты UI
import { NetWorthCard } from "@components/Home/NetWorthCard"
import { GiftCard } from "@components/Home/GiftCard"
import BottomNavigation from "@components/navigation/BottomNavigation"

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"inventory" | "stats">("inventory")

  // 2. Используем хук для получения реальных данных
  const { items, isLoading, isError, refetch } = useInventory()

  // 3. Аналитика теперь считается на основе пришедших items, а не моков
  const analytics = useProfileAnalytics(items)

  // 4. Лоадер на весь экран, пока грузятся данные
  if (isLoading) {
    return (
      <Center minH="100vh" bg="#0F1115" flexDirection="column" gap={4}>
        <Spinner size="xl" color="blue.400" thickness="4px" speed="0.65s" />
        <Text color="gray.500" fontSize="sm">
          Loading assets...
        </Text>
      </Center>
    )
  }

  // 5. Обработка ошибки загрузки
  if (isError) {
    return (
      <Center minH="100vh" bg="#0F1115" flexDirection="column" gap={4}>
        <Text color="red.400">Failed to load inventory</Text>
        <Button onClick={refetch} size="sm" colorScheme="blue">
          Try Again
        </Button>
      </Center>
    )
  }

  return (
    <Box minH="100vh" bg="#0F1115" color="white" pb="100px" px="16px" pt="16px">
      {/* Карточка баланса */}
      <NetWorthCard {...analytics} />

      {/* Табы */}
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
          label="Items"
          badge={items.length} // Используем реальную длину массива
        />
        <TabButton
          isActive={activeTab === "stats"}
          onClick={() => setActiveTab("stats")}
          label="Analytics"
        />
      </Flex>

      {/* Контент */}
      <Box animation="fadeIn 0.3s ease-in-out">
        {activeTab === "inventory" ? (
          <>
            {items.length === 0 ? (
              // Если инвентарь пуст
              <Center py={10} flexDirection="column">
                <Text fontSize="42px">🤷‍♂️</Text>
                <Text color="gray.500" mt={2}>
                  No items found
                </Text>
              </Center>
            ) : (
              <SimpleGrid columns={2} spacing="12px">
                {items.map((item) => (
                  <GiftCard key={item.id} item={item} />
                ))}
              </SimpleGrid>
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

// Маленький локальный компонент для кнопки таба (можно вынести, но он прост)
const TabButton = ({ isActive, onClick, label, badge }: any) => (
  <Box
    as="button"
    flex={1}
    py="12px"
    borderRadius="10px"
    bg={isActive ? "#1F232E" : "transparent"}
    color={isActive ? "white" : "gray.500"}
    fontWeight={isActive ? "600" : "500"}
    fontSize="14px"
    border="1px solid"
    borderColor={isActive ? "whiteAlpha.50" : "transparent"}
    onClick={onClick}
    display="flex"
    alignItems="center"
    justifyContent="center"
    gap="8px"
    transition="all 0.2s"
    _active={{ transform: "scale(0.98)" }}
  >
    {label}
    {badge !== undefined && (
      <Box
        bg={isActive ? "whiteAlpha.300" : "whiteAlpha.100"}
        px="5px"
        borderRadius="4px"
        fontSize="10px"
        fontWeight="bold"
      >
        {badge}
      </Box>
    )}
  </Box>
)

const StatisticsView = ({ analytics }: { analytics: any }) => {
  return (
    <Box>
      <Box
        bg="#161920" // Chakra UI prop
        borderRadius="20px" // Chakra UI prop
        p="20px" // Chakra UI prop
        border="1px solid"
        borderColor="whiteAlpha.100" // Chakra UI prop
      >
        <Text fontSize="16px" fontWeight="700" mb="16px" color="white">
          Portfolio Growth
        </Text>

        {/* Chart Placeholder */}
        <Box
          height="180px"
          bg="linear-gradient(180deg, rgba(22,25,32,0) 0%, rgba(0,152,234,0.05) 100%)"
          borderRadius="16px"
          mb="20px"
          border="1px dashed"
          borderColor="whiteAlpha.100"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Flex align="flex-end" gap="8px" h="80px">
            {[30, 45, 35, 60, 50, 80, 65].map((h, i) => (
              <Box
                key={i}
                w="12px"
                h={`${h}%`}
                bg={i === 5 ? "#0098EA" : "whiteAlpha.100"}
                borderRadius="4px"
              />
            ))}
          </Flex>
          <Text color="gray.600" fontSize="12px" mt="12px">
            Last 7 Days Activity
          </Text>
        </Box>

        {/* Stat Rows */}
        <Flex direction="column" gap="0">
          <StatRow label="Total Items Owned" value={analytics.itemCount.toString()} />
          <StatRow label="Realized PnL" value="+450 TON" highlight />
          <StatRow label="Total Volume" value="1,250 TON" />
          <StatRow label="Best Sale" value="500 TON" />
        </Flex>
      </Box>
    </Box>
  )
}

// --- Статический компонент StatRow ---
const StatRow = ({ label, value, highlight }: any) => (
  <Flex
    justify="space-between"
    align="center"
    py="12px"
    borderBottom="1px solid"
    borderColor="whiteAlpha.50"
    _last={{ borderBottom: "none" }}
  >
    <Text fontSize="13px" color="gray.400">
      {label}
    </Text>
    <Text
      fontSize="14px"
      fontWeight={highlight ? "700" : "600"}
      color={highlight ? "green.400" : "white"}
    >
      {value}
    </Text>
  </Flex>
)

export default ProfilePage
