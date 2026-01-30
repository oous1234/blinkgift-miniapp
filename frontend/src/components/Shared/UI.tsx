import React from "react"
import { Flex, Text, Box, BoxProps, FlexProps, Image } from "@chakra-ui/react"

// Базовый контейнер ("стекло")
export const CardSurface: React.FC<BoxProps> = (props) => (
  <Box
    bg="whiteAlpha.50"
    borderRadius="28px"
    border="1px solid"
    borderColor="whiteAlpha.100"
    backdropFilter="blur(10px)"
    transition="all 0.2s ease"
    {...props}
  />
)

// Профессиональная строка статистики
interface StatRowProps extends FlexProps {
  label: string
  value: string | number
  isAccent?: boolean
  icon?: React.ReactNode
}

export const StatRow: React.FC<StatRowProps> = ({ label, value, isAccent, icon, ...props }) => (
  <Flex
    justify="space-between"
    align="center"
    py="14px"
    borderBottom="1px solid"
    borderColor="whiteAlpha.50"
    _last={{ border: "none" }}
    {...props}
  >
    <Flex align="center" gap={2}>
      {icon}
      <Text color="whiteAlpha.400" fontSize="11px" fontWeight="800" textTransform="uppercase" letterSpacing="0.8px">
        {label}
      </Text>
    </Flex>
    <Text fontSize="14px" fontWeight="800" color={isAccent ? "brand.500" : "white"}>
      {value}
    </Text>
  </Flex>
)

// Унифицированный Badge для редкости/статуса
export const StatusBadge: React.FC<{ children: React.ReactNode; variant?: "blue" | "orange" | "purple" }> = ({
  children,
  variant = "blue"
}) => {
  const colors = {
    blue: { bg: "blue.500", text: "white" },
    orange: { bg: "orange.400", text: "white" },
    purple: { bg: "purple.500", text: "white" },
  }
  return (
    <Box
      bg={colors[variant].bg}
      color={colors[variant].text}
      px={2}
      py={0.5}
      borderRadius="8px"
      fontSize="9px"
      fontWeight="900"
      textTransform="uppercase"
    >
      {children}
    </Box>
  )
}