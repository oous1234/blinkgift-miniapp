import React from "react"
import { Box, Text, AspectRatio, Image } from "@chakra-ui/react"
import { GiftRibbon } from "./GiftRibbon"

interface GiftCardProps {
  item: {
    id: string
    name: string
    image: string
    num: number
    slug: string
  }
  onClick: (item: any) => void
}

export const GiftCard: React.FC<GiftCardProps> = ({ item, onClick }) => {
  return (
    <Box
      position="relative"
      onClick={() => onClick(item)}
      cursor="pointer"
      transition="all 0.2s ease"
      _active={{ transform: "scale(0.96)" }}
      _hover={{ transform: "translateY(-2px)" }}
    >
      <AspectRatio ratio={1}>
        <Box
          borderRadius="24px"
          bg="#161920"
          overflow="hidden"
          position="relative"
          border="1px solid"
          borderColor="whiteAlpha.100"
          boxShadow="0 10px 25px rgba(0,0,0,0.3)"
        >
          {/* Номер в виде стеклянной полоски */}
          <GiftRibbon num={item.num} id={item.id} />

          {/* Изображение подарка на весь фон */}
          <Image
            src={item.image}
            w="100%"
            h="100%"
            objectFit="cover"
          />

          {/* Градиент снизу */}
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            h="45%"
            bgGradient="linear(to-t, rgba(0,0,0,0.9) 0%, transparent 100%)"
            pointerEvents="none"
          />

          {/* Название подарка */}
          <Box position="absolute" bottom="12px" left="0" right="0" textAlign="center" px={2} zIndex={5}>
            <Text
              fontSize="13px"
              fontWeight="900"
              color="white"
              letterSpacing="0.5px"
              noOfLines={1}
            >
              {item.name}
            </Text>
          </Box>
        </Box>
      </AspectRatio>
    </Box>
  )
}