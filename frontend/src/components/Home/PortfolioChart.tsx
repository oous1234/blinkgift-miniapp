import React, { useMemo } from "react"
import { Box, Button, HStack, Text } from "@chakra-ui/react"
import { PortfolioHistory } from "../../types/owner"

interface PortfolioChartProps {
  history: PortfolioHistory | null
  selectedPeriod: string
  onPeriodChange: (period: string) => void
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({
  history,
  selectedPeriod,
  onPeriodChange,
}) => {
  const chartData = useMemo(() => history?.data || [], [history])

  // Константы дизайна
  const ACCENT_COLOR = "#e8d7fd" // Фирменный лавандовый
  const ACCENT_GLOW = "rgba(232, 215, 253, 0.4)"

  const chartParams = useMemo(() => {
    if (chartData.length < 2) return null

    const values = chartData.map((p) => p.average.ton)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1

    const padding = range * 0.15
    const displayMin = min - padding
    const displayMax = max + padding
    const displayRange = displayMax - displayMin

    const width = 300
    const height = 120

    const points = chartData
      .map((p, i) => {
        const x = (i / (chartData.length - 1)) * width
        const y = height - ((p.average.ton - displayMin) / displayRange) * height
        return `${x},${y}`
      })
      .join(" ")

    const areaPoints = `${points} ${width},${height} 0,${height}`

    return {
      points,
      areaPoints,
      width,
      height,
    }
  }, [chartData])

  if (!chartParams) {
    return (
      <Box h="180px" display="flex" alignItems="center" justifyContent="center">
        <Text color="gray.500" fontSize="xs">
          Загрузка аналитики...
        </Text>
      </Box>
    )
  }

  return (
    <Box>
      {/* Кнопки переключения периодов в стиле "стеклянного" меню */}
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

      {/* Контейнер графика с мягким свечением */}
      <Box
        position="relative"
        w="100%"
        h="140px"
        mb={2}
        _before={{
          content: '""',
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "60%",
          background: ACCENT_COLOR,
          filter: "blur(40px)",
          opacity: 0.1,
          pointerEvents: "none",
        }}
      >
        <svg
          viewBox={`0 0 ${chartParams.width} ${chartParams.height}`}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
        >
          <defs>
            {/* Градиент заливки под графиком */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT_COLOR} stopOpacity="0.25" />
              <stop offset="100%" stopColor={ACCENT_COLOR} stopOpacity="0" />
            </linearGradient>

            {/* Фильтр свечения самой линии */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Заливка (Area) */}
          <polyline
            fill="url(#areaGradient)"
            points={chartParams.areaPoints}
            style={{ transition: "all 0.5s ease" }}
          />

          {/* Теневая/фоновая линия для объема */}
          <polyline
            fill="none"
            stroke={ACCENT_COLOR}
            strokeWidth="4"
            strokeOpacity="0.1"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={chartParams.points}
          />

          {/* Основная линия графика */}
          <polyline
            fill="none"
            stroke={ACCENT_COLOR}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={chartParams.points}
            filter="url(#glow)"
            style={{ transition: "all 0.5s ease" }}
          />
        </svg>
      </Box>
    </Box>
  )
}
