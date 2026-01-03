import React from "react"
import { Box, Text, AspectRatio } from "@chakra-ui/react"
import { GiftItem } from "../data"
import { GiftRibbon } from "./GiftRibbon"

export const GiftCard: React.FC<{ item: GiftItem }> = ({ item }) => {
  // Если фон пришел с бека (через маппер) - берем его, иначе дефолтный серый
  const bgStyle =
    item.background || "radial-gradient(circle at center, rgb(60, 60, 60) 0%, rgb(20, 20, 20) 100%)"

  const titleColor = "rgb(235, 212, 200)"

  return (
    <Box position="relative">
      <AspectRatio ratio={1}>
        <Box
          borderRadius="16px"
          bg="#0F0F0F"
          border="1px solid"
          borderColor="whiteAlpha.100"
          overflow="hidden"
          transition="all 0.3s cubic-bezier(.25,.8,.25,1)"
          _hover={{ borderColor: "purple.500", transform: "translateY(-2px)" }}
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
              textShadow="0px 4px 10px rgba(0,0,0,0.5)"
            >
              {item.name}
            </Text>
          </Box>
        </Box>
      </AspectRatio>

      {/* --- ИСПРАВЛЕНИЕ: Передаем item.num вместо item.quantity --- */}
      <GiftRibbon num={item.num} id={item.id} />
    </Box>
  )
}