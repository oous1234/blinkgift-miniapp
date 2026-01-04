import React, { useMemo, useState, useRef, useCallback } from "react"
import { Box, HStack, Text, VStack, Center, Flex } from "@chakra-ui/react"
import { motion, AnimatePresence } from "framer-motion"
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const ACCENT_COLOR = "#E8D7FD"
  const ACCENT_COLOR_RGB = "232, 215, 253"
  const width = 1000
  const height = 400

  const { coords, pathData, areaData, activeData, stats } = useMemo(() => {
    const data = historyData || []
    if (data.length < 2)
      return { coords: [], pathData: "", areaData: "", activeData: [], stats: null }

    const values = data.map((p) => p.average.ton)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1

    const padding = range * 0.1
    const dMin = min - padding
    const dMax = max + padding
    const dRange = dMax - dMin

    const calculatedCoords = data.map((p, i) => ({
      x: (i / (data.length - 1)) * width,
      y: height - ((p.average.ton - dMin) / dRange) * height,
      data: p,
    }))

    const createSmoothPath = (points: { x: number; y: number }[]) => {
      return points.reduce((acc, point, i, a) => {
        if (i === 0) return `M ${point.x},${point.y}`
        const p0 = a[i - 1]
        const cp1x = p0.x + (point.x - p0.x) / 2
        return `${acc} C ${cp1x},${p0.y} ${cp1x},${point.y} ${point.x},${point.y}`
      }, "")
    }

    const path = createSmoothPath(calculatedCoords)
    const area = `${path} L ${width},${height} L 0,${height} Z`

    const firstPrice = values[0]
    const lastPrice = values[values.length - 1]
    const diff = lastPrice - firstPrice
    const percent = (diff / firstPrice) * 100

    return {
      coords: calculatedCoords,
      pathData: path,
      areaData: area,
      activeData: data,
      stats: { diff, percent, lastPrice },
    }
  }, [historyData])

  const handleInteraction = useCallback(
    (clientX: number) => {
      if (!containerRef.current || coords.length === 0) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = ((clientX - rect.left) / rect.width) * width

      let closestIndex = Math.round((x / width) * (coords.length - 1))
      closestIndex = Math.max(0, Math.min(closestIndex, coords.length - 1))
      setSelectedIndex(closestIndex)
    },
    [coords]
  )

  if (activeData.length < 2) {
    return (
      <Center h="250px">
        <Text color="whiteAlpha.400" fontSize="sm">
          Загрузка данных...
        </Text>
      </Center>
    )
  }

  const currentIndex = selectedIndex !== null ? selectedIndex : activeData.length - 1
  const currentPoint = activeData[currentIndex]
  const isGrowing = (stats?.percent ?? 0) >= 0

  return (
    <Box w="100%" userSelect="none">
      {/* Динамический заголовок */}
      <VStack align="flex-start" spacing={0} mb={4} px={1}>
        <Text
          fontSize="10px"
          fontWeight="bold"
          color="whiteAlpha.500"
          textTransform="uppercase"
          letterSpacing="1px"
        >
          {selectedIndex !== null ? "Цена" : "Баланс"}
        </Text>

        <HStack align="baseline" spacing={2}>
          <Text fontSize="30px" fontWeight="800" color="white" lineHeight="1.2">
            {currentPoint.average.ton.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
          <Text fontSize="14px" fontWeight="700" color={ACCENT_COLOR}>
            TON
          </Text>
        </HStack>

        <HStack spacing={2} mt={1}>
          <Flex
            bg={isGrowing ? "rgba(72, 187, 120, 0.2)" : "rgba(245, 101, 101, 0.2)"}
            px={2}
            py={0.5}
            borderRadius="6px"
            align="center"
          >
            <Text fontSize="11px" fontWeight="bold" color={isGrowing ? "green.300" : "red.300"}>
              {isGrowing ? "+" : ""}
              {stats?.percent.toFixed(2)}%
            </Text>
          </Flex>
          <Text fontSize="11px" color="whiteAlpha.500" fontWeight="600">
            {new Date(currentPoint.date).toLocaleString([], {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </HStack>
      </VStack>

      {/* Область графика */}
      <Box
        ref={containerRef}
        position="relative"
        h="200px"
        w="100%"
        cursor="crosshair"
        onMouseMove={(e) => handleInteraction(e.clientX)}
        onTouchMove={(e) => handleInteraction(e.touches[0].clientX)}
        onMouseLeave={() => setSelectedIndex(null)}
        onTouchEnd={() => setSelectedIndex(null)}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`rgba(${ACCENT_COLOR_RGB}, 0.25)`} />
              <stop offset="100%" stopColor={`rgba(${ACCENT_COLOR_RGB}, 0)`} />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Сетка */}
          <line x1="0" y1={height} x2={width} y2={height} stroke="whiteAlpha.100" strokeWidth="1" />

          {/* Заливка под линией */}
          <motion.path d={areaData} fill="url(#chartGradient)" />

          {/* Основная плавная линия */}
          <motion.path
            d={pathData}
            fill="none"
            stroke={ACCENT_COLOR}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Курсор (линия и точка) */}
          <AnimatePresence>
            {selectedIndex !== null && (
              <g>
                <line
                  x1={coords[currentIndex].x}
                  y1="0"
                  x2={coords[currentIndex].x}
                  y2={height}
                  stroke="whiteAlpha.300"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <circle
                  cx={coords[currentIndex].x}
                  cy={coords[currentIndex].y}
                  r="6"
                  fill="white"
                  filter="url(#glow)"
                />
              </g>
            )}
          </AnimatePresence>
        </svg>
      </Box>

      {/* Кнопки периодов */}
      <HStack spacing={1} mt={6} bg="whiteAlpha.50" p={1} borderRadius="12px">
        {["12h", "24h", "7d", "30d"].map((period) => {
          const isActive = selectedPeriod === period
          return (
            <Box
              key={period}
              as="button"
              flex={1}
              py={1.5}
              position="relative"
              onClick={() => onPeriodChange(period)}
              outline="none"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: ACCENT_COLOR,
                    borderRadius: "8px",
                  }}
                />
              )}
              <Text
                position="relative"
                zIndex={1}
                fontSize="11px"
                fontWeight="800"
                color={isActive ? "black" : "whiteAlpha.500"}
              >
                {period.toUpperCase()}
              </Text>
            </Box>
          )
        })}
      </HStack>
    </Box>
  )
}
