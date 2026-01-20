import React, { useState, useEffect } from "react"
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

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % banners.length)
        }, 3000)
        return () => clearInterval(timer)
    }, [])

    const current = banners[index]

    return (
        <Box
            w="100%"
            // Мобилки: 140px (чтобы точно закрыло челку), ПК: 32px (очень тонкий и аккуратный)
            h={{ base: "140px", md: "32px" }}
            overflow="hidden"
            borderBottomLeftRadius={{ base: "25px", md: "12px" }}
            borderBottomRightRadius={{ base: "25px", md: "12px" }}
            position="relative"
            zIndex={11}
            // Отступ под системную челку iPhone
            pt="env(safe-area-inset-top)"
        >
            {/* ФОНОВЫЙ СЛОЙ — плавно переливается */}
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
                // На мобилках прижимаем к низу, на ПК — по центру
                align={{ base: "flex-end", md: "center" }}
                justify="center"
                // На мобилках отступаем от самого края, чтобы текст не "прилипал" к низу
                pb={{ base: "20px", md: "0" }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current.id}
                        // Анимация текста: вылетает сверху вниз
                        initial={{ y: -15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 15, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <HStack spacing={2.5}>
                            <Icon
                                as={current.icon}
                                color={current.textColor}
                                boxSize={{ base: "13px", md: "14px" }}
                            />
                            <Text
                                color={current.textColor}
                                fontWeight="900"
                                // Шрифт: на мобилках чуть меньше, чтобы выглядело изящнее
                                fontSize={{ base: "10px", md: "11px" }}
                                letterSpacing="0.4px"
                                textTransform="uppercase"
                                textAlign="center"
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