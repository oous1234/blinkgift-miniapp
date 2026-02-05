import React from "react"
import { Flex, Text, HStack } from "@chakra-ui/react"
import { GiftStat } from "../../types/domain"
import { TonValue } from "../Shared/TonValue"

export const MarketStatRow: React.FC<{ stat: GiftStat }> = ({ stat }) => (
  <Flex
    justify="space-between"
    align="center"
    py="12px"
    borderBottom="1px solid"
    borderColor="whiteAlpha.50"
    _last={{ borderBottom: "none" }}
  >
    <Text fontSize="13px" fontWeight="700" color="gray.300" flex={1}>
      {stat.label}
    </Text>
    <Text fontSize="13px" fontWeight="800" color="whiteAlpha.600" w="60px" textAlign="center">
      {stat.count}
    </Text>
    <Box w="90px" display="flex" justifyContent="flex-end">
      {stat.floor ? (
        <TonValue value={stat.floor} fontSize="14px" iconSize="12px" />
      ) : (
        <Text fontSize="14px" fontWeight="900" color="gray.600">—</Text>
      )}
    </Box>
  </Flex>
)