// src/views/Home/components/StatRow.tsx
import React from "react"
import { Flex, Text } from "@chakra-ui/react"

interface StatRowProps {
  label: string
  value: string | number
  isAccent?: boolean
}

export const StatRow: React.FC<StatRowProps> = ({ label, value, isAccent }) => (
  <Flex
    justify="space-between"
    py="12px"
    borderBottom="1px solid"
    borderColor="whiteAlpha.50"
    _last={{ border: "none" }}
  >
    <Text color="gray.500" fontSize="11px" fontWeight="600" textTransform="uppercase">
      {label}
    </Text>
    <Text fontSize="13px" fontWeight="700" color={isAccent ? "#e8d7fd" : "white"}>
      {value}
    </Text>
  </Flex>
)
