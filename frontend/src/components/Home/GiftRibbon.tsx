import React from "react"
import { Box, Text } from "@chakra-ui/react"

interface GiftRibbonProps {
  num: number
  id: string
}

export const GiftRibbon: React.FC<GiftRibbonProps> = ({ num }) => {
  return (
    <Box
      position="absolute"
      top="0"
      right="0"
      w="100%"
      h="100%"
      zIndex={10}
      overflow="hidden"
      pointerEvents="none"
      borderTopRightRadius="24px" // Должно совпадать с радиусом карточки
    >
      {/* Сама полоска */}
      <Box
        position="absolute"
        top="18px"
        right="-28px"
        w="110px"
        transform="rotate(45deg)"
        bg="rgba(255, 255, 255, 0.15)"
        backdropFilter="blur(10px) saturate(150%)"
        borderY="1px solid rgba(255, 255, 255, 0.2)"
        boxShadow="0 4px 10px rgba(0,0,0,0.3)"
        py="2px"
        textAlign="center"
      >
        <Text
          fontSize="11px"
          fontWeight="900"
          color="white"
          textShadow="0 1px 3px rgba(0,0,0,0.5)"
          letterSpacing="0.5px"
        >
          #{num}
        </Text>
      </Box>

      <Box
        position="absolute"
        top="35px"
        right="-15px"
        w="80px"
        h="10px"
        bg="blackAlpha.400"
        filter="blur(8px)"
        transform="rotate(45deg)"
        zIndex={-1}
      />
    </Box>
  )
}