import React from "react"
import { Box, Text, AspectRatio } from "@chakra-ui/react"
import { GiftItem } from "../../types/inventory" // Исправлен путь к типам
import { GiftRibbon } from "./GiftRibbon"

interface GiftCardProps {
  item: GiftItem
  onClick: (item: GiftItem) => void
}

export const GiftCard: React.FC<GiftCardProps> = ({ item, onClick }) => {
  const titleColor = "rgb(235, 212, 200)"

  return (
    <Box position="relative" onClick={() => onClick(item)} cursor="pointer">
      <AspectRatio ratio={1}>
        <Box
          borderRadius="16px"
          bg="#0F0F0F"
          border="1px solid"
          borderColor="whiteAlpha.100"
          overflow="hidden"
          transition="all 0.2s cubic-bezier(.25,.8,.25,1)"
          _active={{ transform: "scale(0.95)", borderColor: "purple.500" }}
        >
          <Box
            w="100%"
            h="100%"
            bgImage={`url(${item.image})`}
            bgSize="cover"
            bgPosition="center center"
            position="absolute"
            top="0"
            left="0"
          />

          <Box position="absolute" bottom="8px" left="0" right="0" textAlign="center" zIndex={2}>
            <Text
              fontSize="14px"
              fontWeight="600"
              color={titleColor}
              textShadow="0px 2px 8px rgba(0,0,0,0.8)"
            >
              {item.name}
            </Text>
          </Box>
        </Box>
      </AspectRatio>

      <GiftRibbon num={item.num} id={item.id} />
    </Box>
  )
}