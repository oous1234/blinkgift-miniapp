import React from "react"
import { Box, Flex, Text, Center } from "@chakra-ui/react"
import { LottieLoader } from "./LottieLoader"

interface GiftPreviewProps {
  giftName: string
  modelUrl?: string
  patternUrl?: string | null
  bg?: {
    center: string
    edge: string
    pattern: string
  } | null
  isSelected: boolean
}

// Координаты для 12 иконок, чтобы они лежали красиво и равномерно
const SPARSE_PATTERN_POS = [
  { t: "15%", l: "10%" }, { t: "15%", l: "35%" }, { t: "15%", l: "65%" }, { t: "15%", l: "90%" },
  { t: "50%", l: "5%" },  { t: "50%", l: "25%" }, { t: "50%", l: "75%" }, { t: "50%", l: "95%" },
  { t: "85%", l: "10%" }, { t: "85%", l: "35%" }, { t: "85%", l: "65%" }, { t: "85%", l: "90%" },
];

export const GiftPreview: React.FC<GiftPreviewProps> = React.memo(({
  giftName, modelUrl, patternUrl, bg, isSelected
}) => {
  return (
    <Box
      position="relative"
      w="100%"
      h="140px"
      borderRadius="28px"
      overflow="hidden"
      bg="#0F1115"
      border="1px solid"
      borderColor="whiteAlpha.100"
      boxShadow="0 10px 30px rgba(0,0,0,0.3)"
      mb={4}
    >
      {/* 1. Фон градиент */}
      <Box
        position="absolute"
        inset={0}
        transition="all 0.6s ease"
        style={{
          background: bg
            ? `radial-gradient(circle at center, ${bg.center} 0%, ${bg.edge} 100%)`
            : "radial-gradient(circle at center, #1F232E 0%, #0F1115 100%)"
        }}
      />

      {/* 2. Разреженный узор (ровно 12 мелких иконок) */}
      {isSelected && patternUrl && (
        <Box position="absolute" inset={0} opacity={0.12}>
          {SPARSE_PATTERN_POS.map((pos, idx) => (
            <Box
              key={idx}
              position="absolute"
              top={pos.t}
              left={pos.l}
              transform="translate(-50%, -50%) rotate(-15deg)"
              boxSize="24px" // Маленький размер иконок узора
              style={{
                WebkitMaskImage: `url(${patternUrl})`,
                maskImage: `url(${patternUrl})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                backgroundColor: bg?.pattern || "white"
              }}
            />
          ))}
        </Box>
      )}

      {/* 3. Анимация подарка */}
      <Center position="absolute" inset={0} zIndex={1}>
        {isSelected && modelUrl && (
          <Box boxSize="110px">
            <LottieLoader url={modelUrl} />
          </Box>
        )}
      </Center>

      {/* 4. Название (внизу слева) */}
      {isSelected && (
        <Box
          position="absolute"
          bottom="12px"
          left="12px"
          zIndex={2}
          bg="blackAlpha.600"
          backdropFilter="blur(10px)"
          px={3}
          py={1.5}
          borderRadius="14px"
          border="1px solid"
          borderColor="whiteAlpha.100"
        >
          <Text fontSize="12px" fontWeight="900" color="white" isTruncated maxW="220px">
            {giftName}
          </Text>
        </Box>
      )}
    </Box>
  )
})