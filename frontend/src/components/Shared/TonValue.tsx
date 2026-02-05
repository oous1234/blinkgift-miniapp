import React from "react"
import { HStack, Text, IconProps } from "@chakra-ui/react"
import { TonIconBlue } from "./Icons"

interface Props {
  value: number | string
  fontSize?: string
  iconSize?: string
  color?: string
}

export const TonValue: React.FC<Props> = ({
  value,
  fontSize = "16px",
  iconSize = "14px",
  color = "white"
}) => (
  <HStack spacing={1.5} align="center">
    <Text fontWeight="900" fontSize={fontSize} color={color}>
      {value}
    </Text>
    <TonIconBlue boxSize={iconSize} />
  </HStack>
)