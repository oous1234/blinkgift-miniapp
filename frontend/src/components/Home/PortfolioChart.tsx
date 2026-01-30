import React, { useMemo, useState, useRef, useCallback } from "react"
import { Box, HStack, Text, VStack, Center, Flex } from "@chakra-ui/react"
import { motion, AnimatePresence } from "framer-motion"
import { HistoryPoint } from "../../types"

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
  const width = 1000
  const height = 400

  const { coords, pathData, areaData, activeData } = useMemo(() => {
    const data = historyData || []
    if (data.length < 2)
      return { coords: [], pathData: "", areaData: "", activeData: [] }

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

    return {
      coords: calculatedCoords,
      pathData: path,
      areaData: area,
      activeData: data,
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
      <Center h="200px">
        <Text color="whiteAlpha.400" fontSize="11px" fontWeight="800">
          НЕДОСТАТОЧНО ДАННЫХ
        </Text>
      </Center>
    )
  }

  const currentIndex = selectedIndex !== null ? selectedIndex : activeData.length - 1
  const currentPoint = activeData[currentIndex]

  return (
    <Box w="100%" userSelect="none">
      <VStack align="flex-start" spacing={0} mb={6}>
        <Text fontSize="10px" fontWeight="900" color="whiteAlpha.400" textTransform="uppercase">
          {selectedIndex !== null ? "Цена в моменте" : "Оценка портфеля"}
        </Text>
        <HStack align="baseline" spacing={2}>
          <Text fontSize="32px" fontWeight="900" color="white" lineHeight="1">
            {currentPoint.average.ton.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
          <Text fontSize="14px" fontWeight="900" color="brand.500">TON</Text>
        </HStack>
        <Text fontSize="11px" color="whiteAlpha.500" fontWeight="700" mt={1}>
          {new Date(currentPoint.date).toLocaleString("ru-RU", {
            day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
          })}
        </Text>
      </VStack>

      <Box
        ref={containerRef}
        position="relative"
        h="180px"
        w="100%"
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
              <stop offset="0%" stopColor={ACCENT_COLOR} stopOpacity="0.3" />
              <stop offset="100%" stopColor={ACCENT_COLOR} stopOpacity="0" />
            </linearGradient>
          </defs>

          <motion.path d={areaData} fill="url(#chartGradient)" />
          <motion.path
            d={pathData}
            fill="none"
            stroke={ACCENT_COLOR}
            strokeWidth="4"
            strokeLinecap="round"
          />

          <AnimatePresence>
            {selectedIndex !== null && (
              <g>
                <line
                  x1={coords[currentIndex].x} y1="0"
                  x2={coords[currentIndex].x} y2={height}
                  stroke="whiteAlpha.300" strokeWidth="2" strokeDasharray="6 6"
                />
                <circle
                  cx={coords[currentIndex].x}
                  cy={coords[currentIndex].y}
                  r="8"
                  fill="white"
                  stroke={ACCENT_COLOR}
                  strokeWidth="4"
                />
              </g>
            )}
          </AnimatePresence>
        </svg>
      </Box>

      <HStack spacing={1} mt={8} bg="whiteAlpha.50" p="4px" borderRadius="14px">
        {["12h", "24h", "7d", "30d"].map((period) => {
          const isActive = selectedPeriod === period
          return (
            <Box
              key={period}
              as="button"
              flex={1}
              py={1.5}
              borderRadius="10px"
              onClick={() => onPeriodChange(period)}
              bg={isActive ? "whiteAlpha.200" : "transparent"}
              color={isActive ? "white" : "whiteAlpha.400"}
              fontSize="11px"
              fontWeight="900"
              transition="0.2s"
            >
              {period.toUpperCase()}
            </Box>
          )
        })}
      </HStack>
    </Box>
  )
}