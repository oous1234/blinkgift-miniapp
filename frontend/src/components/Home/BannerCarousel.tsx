import React, { useState, useEffect } from "react"
import { Box, Image, Flex } from "@chakra-ui/react"
import { motion, AnimatePresence } from "framer-motion"

interface BannerCarouselProps {
  images: string[]
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [images.length])

  if (!images.length) return null

  return (
    <Box
      position="relative"
      // --- ИЗМЕНЕНИЯ ДЛЯ ПОЛНОЙ ШИРИНЫ (EDGE-TO-EDGE) ---
      // Родительский контейнер имеет px="16px", поэтому:
      w="calc(100% + 32px)" // 1. Делаем ширину больше на 32px (16px слева + 16px справа)
      ml="-16px" // 2. Сдвигаем влево на 16px, чтобы прижаться к левому краю экрана
      borderRadius="0" // 3. Убираем скругление полностью
      // --------------------------------------------------

      h="80px"
      overflow="hidden"
      mb={6}
      boxShadow="0 4px 12px rgba(0,0,0,0.3)"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            src={images[currentIndex]}
            alt={`Banner ${currentIndex}`}
            w="100%"
            h="100%"
            objectFit="cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Индикаторы (точки) */}
      <Flex
        position="absolute"
        bottom="8px"
        left="50%"
        transform="translateX(-50%)"
        gap="4px"
        zIndex={2}
      >
        {images.map((_, idx) => (
          <Box
            key={idx}
            w={currentIndex === idx ? "16px" : "4px"}
            h="4px"
            borderRadius="full"
            bg={currentIndex === idx ? "white" : "whiteAlpha.600"}
            transition="all 0.3s ease"
          />
        ))}
      </Flex>

      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        h="24px"
        bgGradient="linear(to-t, rgba(0,0,0,0.5), transparent)"
        pointerEvents="none"
      />
    </Box>
  )
}

export default BannerCarousel
