import React, { useState, useEffect, useMemo } from "react"
import { Box, Text, Icon, HStack, Flex } from "@chakra-ui/react"
import { motion, AnimatePresence } from "framer-motion"
import { StarIcon, InfoIcon, CheckCircleIcon } from "@chakra-ui/icons"

interface BannerData {
  id: number
  text: string
  icon: any
  bgColor: string
  textColor: string
}

const banners: BannerData[] = [
  {
    id: 1,
    text: "IN'SNAP — ЛУЧШИЙ ПРОЕКТ ДЛЯ ГИФТОВ",
    icon: StarIcon,
    bgColor: "#E8D7FD",
    textColor: "#0F1115",
  },
  {
    id: 2,
    text: "САМАЯ ТОЧНАЯ АНАЛИТИКА РЫНКА",
    icon: CheckCircleIcon,
    bgColor: "#EBD4C8",
    textColor: "#462F24",
  },
  {
    id: 3,
    text: "ОТСЛЕЖИВАЙ СВОЙ P/L В РЕАЛЬНОМ ВРЕМЕНИ",
    icon: InfoIcon,
    bgColor: "#161920",
    textColor: "#E8D7FD",
  },
]

const MotionBox = motion(Box)

const AdBanner: React.FC = () => {
  const [index, setIndex] = useState(0)

  const isMobileDevice = useMemo(() => {
    const platform = window.Telegram?.WebApp?.platform || "unknown"
    return platform === "android" || platform === "ios"
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const current = banners[index]

  const config = {
    height: isMobileDevice ? "140px" : "48px",
    paddingTop: isMobileDevice ? "env(safe-area-inset-top)" : "0px",
    fontSize: isMobileDevice ? "10px" : "9px",
    iconSize: isMobileDevice ? "13px" : "10px",
    borderRadius: isMobileDevice ? "25px" : "12px",
    align: "flex-end",
    paddingBottom: isMobileDevice ? "20px" : "8px",
  }

  return (
    <Box
      w="100%"
      h={config.height}
      overflow="hidden"
      borderBottomLeftRadius={config.borderRadius}
      borderBottomRightRadius={config.borderRadius}
      position="relative"
      zIndex={11}
      pt={config.paddingTop}
    >
      {/* ФОНОВЫЙ СЛОЙ */}
      <MotionBox
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        initial={false}
        animate={{ backgroundColor: current.bgColor }}
        transition={{ duration: 1, ease: "linear" }}
      />

      {/* КОНТЕНТНЫЙ СЛОЙ */}
      <Flex
        position="relative"
        zIndex={2}
        h="100%"
        align={config.align}
        justify="center"
        pb={config.paddingBottom}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 5, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <HStack spacing={2}>
              <Icon as={current.icon} color={current.textColor} boxSize={config.iconSize} />
              <Text
                color={current.textColor}
                fontWeight="900"
                fontSize={config.fontSize}
                letterSpacing="0.4px"
                textTransform="uppercase"
                textAlign="center"
                lineHeight="1"
              >
                {current.text}
              </Text>
            </HStack>
          </motion.div>
        </AnimatePresence>
      </Flex>
    </Box>
  )
}

export default AdBanner
