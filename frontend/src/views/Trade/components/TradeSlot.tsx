import React from "react"
import { Box, Center, Image } from "@chakra-ui/react"

export const TradeSlot: React.FC<{ image?: string }> = ({ image }) => {
  return (
    <Box
      w="100%"
      pt="100%"
      position="relative"
      bg="rgba(255, 255, 255, 0.03)"
      borderRadius="14px"
      border="1px solid"
      borderColor="whiteAlpha.100"
    >
      <Center position="absolute" inset={0} p={3}>
        {image && (
          <Image
            src={image}
            opacity={0.3}
            filter="grayscale(100%)"
          />
        )}
      </Center>
    </Box>
  )
}