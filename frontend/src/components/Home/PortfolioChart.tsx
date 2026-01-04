import React, { useMemo } from "react"
import { Box, Button, HStack, Text } from "@chakra-ui/react"
import { HistoryPoint } from "../../types/owner"

interface PortfolioChartProps {
  historyData: HistoryPoint[]
  selectedPeriod: string
  onPeriodChange: (period: string) => void
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({
  historyData,
  selectedPeriod,
  onPeriodChange,
}) => {
  // Дизайн
  const ACCENT_COLOR = "#e8d7fd"

  const chartParams = useMemo(() => {
    if (!historyData || historyData.length < 2) return null

    const values = historyData.map((p) => p.average.ton)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1

    const padding = range * 0.15
    const displayMin = min - padding
    const displayMax = max + padding
    const displayRange = displayMax - displayMin

    const width = 300
    const height = 120

    const points = historyData
      .map((p, i) => {
        const x = (i / (historyData.length - 1)) * width
        const y = height - ((p.average.ton - displayMin) / displayRange) * height
        return `${x},${y}`
      })
      .join(" ")

    const areaPoints = `${points} ${width},${height} 0,${height}`

    return { points, areaPoints, width, height }
  }, [historyData])

  if (!chartParams) {
    return (
      <Box h="140px" display="flex" alignItems="center" justifyContent="center">
        <Text color="gray.500" fontSize="xs">
          Нет данных для этого периода
        </Text>
      </Box>
    )
  }

  return (
    <Box>
      {/* Селектор периодов */}
      <HStack
        spacing={1}
        mb={8}
        justify="center"
        bg="whiteAlpha.50"
        p={1}
        borderRadius="12px"
        w="fit-content"
        mx="auto"
      >
        {["12h", "24h", "7d", "30d"].map((period) => (
          <Button
            key={period}
            size="xs"
            variant="ghost"
            borderRadius="9px"
            onClick={() => onPeriodChange(period)}
            fontSize="10px"
            fontWeight="800"
            px={4}
            h="28px"
            color={selectedPeriod === period ? "black" : "gray.400"}
            bg={selectedPeriod === period ? ACCENT_COLOR : "transparent"}
            _hover={{ bg: selectedPeriod === period ? ACCENT_COLOR : "whiteAlpha.100" }}
            _active={{ transform: "scale(0.95)" }}
            transition="all 0.2s"
          >
            {period.toUpperCase()}
          </Button>
        ))}
      </HStack>

      {/* SVG График */}
      <Box position="relative" w="100%" h="140px" mb={2}>
        <svg
          viewBox={`0 0 ${chartParams.width} ${chartParams.height}`}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT_COLOR} stopOpacity="0.25" />
              <stop offset="100%" stopColor={ACCENT_COLOR} stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <polyline
            fill="url(#areaGradient)"
            points={chartParams.areaPoints}
            style={{ transition: "all 0.4s ease-in-out" }}
          />

          <polyline
            fill="none"
            stroke={ACCENT_COLOR}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={chartParams.points}
            filter="url(#glow)"
            style={{ transition: "all 0.4s ease-in-out" }}
          />
        </svg>
      </Box>
    </Box>
  )
}
