import React, { useMemo } from "react"
import { Box, Button, HStack } from "@chakra-ui/react"
import { PortfolioHistory } from "../../types/owner"

export const PortfolioChart: React.FC<any> = ({ history, selectedPeriod, onPeriodChange }) => {
  const data = history[selectedPeriod] || []

  const chartParams = useMemo(() => {
    if (data.length < 2) return null
    const values = data.map((p: any) => p.average.ton)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1
    const padding = range * 0.15
    const displayMin = min - padding
    const displayMax = max + padding
    const displayRange = displayMax - displayMin
    const width = 300
    const height = 100

    const points = data
      .map((p: any, i: number) => {
        const x = (i / (data.length - 1)) * width
        const y = height - ((p.average.ton - displayMin) / displayRange) * height
        return `${x},${y}`
      })
      .join(" ")

    return { points, width, height }
  }, [data])

  if (!chartParams) return <Box h="100px" />

  const accentColor = "#e8d7fd"

  return (
    <Box>
      <HStack spacing={2} mb={6} justify="center">
        {[
          { id: "12h", label: "12ч" },
          { id: "24h", label: "24ч" },
          { id: "7d", label: "7д" },
          { id: "30d", label: "30д" },
        ].map((p) => (
          <Button
            key={p.id}
            size="xs"
            variant="unstyled"
            onClick={() => onPeriodChange(p.id)}
            fontSize="11px"
            fontWeight="700"
            color={selectedPeriod === p.id ? accentColor : "gray.600"}
            transition="all 0.2s"
            px={2}
          >
            {p.label}
          </Button>
        ))}
      </HStack>

      <Box w="100%" h="100px" mb={4}>
        <svg
          viewBox={`0 0 ${chartParams.width} ${chartParams.height}`}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke={accentColor}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={chartParams.points}
          />
        </svg>
      </Box>
    </Box>
  )
}
