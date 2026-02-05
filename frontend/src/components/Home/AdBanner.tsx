import React, { useState, useEffect, useMemo } from "react";
import { Box, Text, Icon, HStack, Flex } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { StarIcon, InfoIcon, CheckCircleIcon } from "@chakra-ui/icons";

interface BannerData {
  id: number;
  text: string;
  icon: any;
  bgColor: string;
  textColor: string;
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
];

const MotionBox = motion(Box);

const AdBanner: React.FC = () => {
  const [index, setIndex] = useState(0);

  const isMobile = useMemo(() => {
    const platform = window.Telegram?.WebApp?.platform || "unknown";
    return platform === "android" || platform === "ios";
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = banners[index];

  // Конфигурация размеров
  const height = isMobile ? "140px" : "50px";
  const paddingTop = isMobile ? "env(safe-area-inset-top)" : "0px";

  return (
    <Box
      w="100%"
      h={height}
      overflow="hidden"
      position="relative"
      zIndex={10}
      pt={paddingTop}
    >
      <AnimatePresence mode="wait">
        <MotionBox
          key={`bg-${current.id}`}
          position="absolute"
          inset={0}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, backgroundColor: current.bgColor }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
      </AnimatePresence>

      <Flex
        position="relative"
        zIndex={2}
        h="100%"
        align="center"
        justify="center"
        px={4}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <HStack spacing={3}>
              <Icon as={current.icon} color={current.textColor} boxSize="14px" />
              <Text
                color={current.textColor}
                fontWeight="900"
                fontSize={isMobile ? "11px" : "10px"}
                letterSpacing="0.5px"
                textAlign="center"
                textTransform="uppercase"
              >
                {current.text}
              </Text>
            </HStack>
          </motion.div>
        </AnimatePresence>
      </Flex>
    </Box>
  );
};

export default AdBanner;