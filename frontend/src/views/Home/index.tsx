import React, { useState, useMemo } from "react"
import { Box, Text, Flex, SimpleGrid, Image } from "@chakra-ui/react"
import {
  WrapperStyle,
  NetWorthCardStyle,
  GlowEffectStyle,
  StatLabelStyle,
  StatValueMainStyle,
  TabContainerStyle,
  TabButtonStyle,
  GiftCardStyle,
  GiftImageContainer,
  GiftImageStyle,
  GiftInfoContainer,
  RarityBadgeStyle,
  StatCardStyle,
  ChartPlaceholderStyle,
} from "./styles"
import { MOCK_INVENTORY, GiftItem } from "./data"
// Импортируем новый компонент (поправьте путь если нужно)
import BottomNavigation from "../../components/BottomNavigation"

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"inventory" | "stats">("inventory")

  // --- ANALYTICS ENGINE (Без изменений) ---
  const analytics = useMemo(() => {
    let totalValue = 0
    let totalInvested = 0
    let itemCount = 0
    let bestPerformer = { name: "None", profit: -Infinity }

    MOCK_INVENTORY.forEach((item) => {
      const itemValue = item.floorPrice * item.quantity
      const itemCost = item.purchasePrice * item.quantity
      const profit = itemValue - itemCost

      totalValue += itemValue
      totalInvested += itemCost
      itemCount += item.quantity

      if (profit > bestPerformer.profit) {
        bestPerformer = { name: item.name, profit }
      }
    })

    const totalPnL = totalValue - totalInvested
    const pnlPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

    return { totalValue, totalPnL, pnlPercent, itemCount, bestPerformer }
  }, [])

  return (
    <Box style={WrapperStyle}>
      {/* 1. NET WORTH CARD (Без изменений) */}
      <Box style={NetWorthCardStyle}>
        <Box style={GlowEffectStyle} />

        <Box position="relative" zIndex={1}>
          <Flex justify="space-between" align="center" mb="12px">
            <Text style={StatLabelStyle}>ESTIMATED BALANCE</Text>
            <Box
              bg={analytics.totalPnL >= 0 ? "rgba(76, 175, 80, 0.2)" : "rgba(255, 82, 82, 0.2)"}
              color={analytics.totalPnL >= 0 ? "#4CAF50" : "#FF5252"}
              px="8px"
              py="2px"
              borderRadius="6px"
              fontSize="12px"
              fontWeight="700"
            >
              {analytics.totalPnL >= 0 ? "+" : ""}
              {analytics.pnlPercent.toFixed(2)}%
            </Box>
          </Flex>

          <Flex align="baseline" gap="8px">
            <Text style={StatValueMainStyle}>{analytics.totalValue.toLocaleString()}</Text>
            <Text fontSize="24px" fontWeight="700" color="#0098EA">
              TON
            </Text>
          </Flex>

          <Text fontSize="14px" color="gray.500" mt="6px" fontWeight="500">
            ≈ ${(analytics.totalValue * 5.2).toLocaleString()} USD
          </Text>

          <Box
            h="1px"
            bg="linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)"
            my="20px"
          />

          <Flex align="center" justify="space-between">
            <Text fontSize="13px" color="gray.400">
              Top Performer
            </Text>
            <Flex align="center" gap="6px">
              <Text fontSize="13px" fontWeight="600" color="white">
                {analytics.bestPerformer.name}
              </Text>
              <Text
                fontSize="12px"
                color="#0098EA"
                bg="rgba(0,152,234,0.1)"
                px="6px"
                borderRadius="4px"
              >
                +{analytics.bestPerformer.profit.toFixed(0)} TON
              </Text>
            </Flex>
          </Flex>
        </Box>
      </Box>

      {/* 2. COMPACT TABS (Обновленный дизайн) */}
      <Box style={TabContainerStyle}>
        <button
          style={TabButtonStyle(activeTab === "inventory")}
          onClick={() => setActiveTab("inventory")}
        >
          Items
          {/* Badge стал меньше и аккуратнее */}
          <Box
            bg={activeTab === "inventory" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)"}
            px="5px"
            borderRadius="4px"
            fontSize="10px"
            fontWeight="700"
          >
            {analytics.itemCount}
          </Box>
        </button>
        <button style={TabButtonStyle(activeTab === "stats")} onClick={() => setActiveTab("stats")}>
          Analytics
        </button>
      </Box>

      {/* 3. CONTENT AREA */}
      <Box animation="fadeIn 0.3s ease-in-out">
        {activeTab === "inventory" ? (
          <SimpleGrid columns={2} spacing="12px">
            {MOCK_INVENTORY.map((item) => (
              <GiftCard key={item.id} item={item} />
            ))}
          </SimpleGrid>
        ) : (
          <StatisticsView analytics={analytics} />
        )}
      </Box>

      {/* 4. BOTTOM NAVIGATION COMPONENT */}
      <BottomNavigation />
    </Box>
  )
}

// --- SUB-COMPONENTS (Остальные компоненты без изменений) ---
// (GiftCard, StatisticsView и StatRow остаются такими же, как в прошлом коде,
// стили импортируются из styles.ts)

const GiftCard = ({ item }: { item: GiftItem }) => {
  return (
    <Box style={GiftCardStyle}>
      {item.quantity > 1 && (
        <Box position="absolute" top="10px" right="10px" zIndex={2}>
          <Box
            bg="#0098EA"
            color="white"
            fontSize="10px"
            fontWeight="bold"
            px="6px"
            py="2px"
            borderRadius="4px"
            boxShadow="0 2px 8px rgba(0,152,234,0.4)"
          >
            x{item.quantity}
          </Box>
        </Box>
      )}
      <Box style={GiftImageContainer}>
        <Image
          src={item.image}
          alt={item.name}
          style={GiftImageStyle}
          fallback={<Text fontSize="42px">🎁</Text>}
        />
      </Box>
      <Box style={GiftInfoContainer}>
        <Text fontSize="14px" fontWeight="700" color="white" isTruncated mb="6px">
          {item.name}
        </Text>
        <Flex justify="space-between" align="flex-end">
          <Flex direction="column">
            <Text fontSize="10px" color="gray.500" mb="1px">
              Floor
            </Text>
            <Text fontSize="14px" fontWeight="700" color="white">
              {item.floorPrice} <span style={{ fontSize: "10px", color: "#0098EA" }}>TON</span>
            </Text>
          </Flex>
          {item.floorPrice > item.purchasePrice && (
            <Text
              fontSize="11px"
              color="#4CAF50"
              fontWeight="600"
              bg="rgba(76,175,80,0.1)"
              px="4px"
              borderRadius="3px"
            >
              +{(item.floorPrice - item.purchasePrice).toFixed(1)}
            </Text>
          )}
        </Flex>
      </Box>
    </Box>
  )
}

const StatisticsView = ({ analytics }: { analytics: any }) => {
  return (
    <Box>
      <Box style={StatCardStyle}>
        <Text fontSize="16px" fontWeight="700" mb="16px" color="white">
          Portfolio Growth
        </Text>
        <Box style={ChartPlaceholderStyle}>
          <Flex align="flex-end" gap="8px" h="80px">
            {[30, 45, 35, 60, 50, 80, 65].map((h, i) => (
              <Box
                key={i}
                w="12px"
                h={`${h}%`}
                bg={i === 5 ? "#0098EA" : "rgba(255,255,255,0.1)"}
                borderRadius="4px"
              />
            ))}
          </Flex>
          <Text color="gray.600" fontSize="12px" mt="12px">
            Last 7 Days Activity
          </Text>
        </Box>
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

const StatRow = ({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) => (
  <Flex
    justify="space-between"
    align="center"
    py="12px"
    borderBottom="1px solid rgba(255,255,255,0.05)"
    _last={{ borderBottom: "none" }}
  >
    <Text fontSize="13px" color="gray.400">
      {label}
    </Text>
    <Text
      fontSize="14px"
      fontWeight={highlight ? "700" : "600"}
      color={highlight ? "#4CAF50" : "white"}
    >
      {value}
    </Text>
  </Flex>
)

export default ProfilePage
