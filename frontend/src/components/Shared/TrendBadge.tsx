import React from "react"
import { Badge } from "@chakra-ui/react"

interface Props {
  value: number | string
  isPercent?: boolean
}

export const TrendBadge: React.FC<Props> = ({ value, isPercent = true }) => {
  const valStr = String(value)
  const isPositive = !valStr.startsWith("-")
  const displayValue = isPercent ? (isPositive ? `+${valStr}%` : `${valStr}%`) : valStr

  return (
    <Badge
      variant="solid"
      bg={isPositive ? "green.500" : "red.500"}
      color="white"
      fontSize="10px"
      borderRadius="6px"
      px={2}
      py={0.5}
    >
      {displayValue}
    </Badge>
  )
}