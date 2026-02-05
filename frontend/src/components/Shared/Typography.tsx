import { HStack, Text, Badge, IconProps } from "@chakra-ui/react";
import { TonIconBlue } from "./Icons";
import React from "react";

export const TonValue: React.FC<{ value: number | string; size?: "sm" | "md" | "lg" }> = ({
  value,
  size = "md"
}) => {
  const fontSizes = { sm: "14px", md: "18px", lg: "32px" };
  const iconSizes = { sm: "12px", md: "16px", lg: "24px" };

  return (
    <HStack spacing={1.5} align="center">
      <Text fontWeight="900" fontSize={fontSizes[size]} color="white">
        {value}
      </Text>
      <TonIconBlue boxSize={iconSizes[size]} />
    </HStack>
  );
};

export const TrendBadge: React.FC<{ value: number }> = ({ value }) => {
  const isPositive = value >= 0;
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
      {isPositive ? "+" : ""}{value.toFixed(1)}%
    </Badge>
  );
};