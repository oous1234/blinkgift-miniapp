// src/components/navigation/BottomNavigation.tsx
import React from "react"
import { Box, Flex, Icon, Text, Pressable, HStack } from "@chakra-ui/react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { HOME, MARKET } from "../../router/paths"

const navItems = [
  {
    id: 0,
    label: "Profile",
    path: HOME,
    icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  },
  { id: 1, label: "Market", path: MARKET, icon: "M3 3v18h18 M18 9l-5 5-4-4-5 5" },
  { id: 2, label: "More", path: "/more", icon: "M12 12h.01 M8 12h.01 M16 12h.01" },
]

const MotionBox = motion(Box)

const BottomNavigation: React.FC<{ onSearchOpen: () => void }> = ({ onSearchOpen }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const activeIndex = navItems.findIndex((item) =>
    item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path)
  )

  const handleNav = (path: string) => {
    navigate(path)
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.selectionChanged()
    }
  }

  return (
    <Box
      position="fixed"
      bottom="30px"
      left={0}
      right={0}
      px={5}
      zIndex={1000}
      pointerEvents="none"
    >
      <HStack spacing={3} pointerEvents="auto">
        {/* Главное меню */}
        <Flex
          flex={1}
          bg="rgba(22, 25, 32, 0.85)"
          backdropFilter="blur(20px)"
          borderRadius="34px"
          height="68px"
          p={1}
          position="relative"
          border="1px solid"
          borderColor="whiteAlpha.100"
        >
          {/* Активная плашка (двигается за индексом) */}
          <MotionBox
            position="absolute"
            top="4px"
            bottom="4px"
            left="4px"
            width="calc(33.33% - 4px)"
            bg="whiteAlpha.200"
            borderRadius="30px"
            animate={{ x: `${activeIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          {navItems.map((item) => {
            const isActive = activeIndex === item.id
            return (
              <Flex
                key={item.id}
                flex={1}
                direction="column"
                align="center"
                justify="center"
                zIndex={1}
                cursor="pointer"
                onClick={() => handleNav(item.path)}
              >
                <Icon viewBox="0 0 24 24" boxSize="22px" mb="2px">
                  <path
                    d={item.icon}
                    fill="none"
                    stroke={isActive ? "#e8d7fd" : "whiteAlpha.400"}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </Icon>
                <Text
                  fontSize="10px"
                  fontWeight="bold"
                  color={isActive ? "#e8d7fd" : "whiteAlpha.400"}
                >
                  {item.label}
                </Text>
              </Flex>
            )
          })}
        </Flex>

        {/* Кнопка поиска */}
        <Flex
          as="button"
          onClick={onSearchOpen}
          w="68px"
          h="68px"
          bg="rgba(22, 25, 32, 0.85)"
          backdropFilter="blur(20px)"
          borderRadius="34px"
          align="center"
          justify="center"
          border="1px solid"
          borderColor="whiteAlpha.100"
          _active={{ transform: "scale(0.92)" }}
          transition="0.2s"
        >
          <Icon viewBox="0 0 24 24" boxSize="24px" color="white">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2.5" />
          </Icon>
        </Flex>
      </HStack>
    </Box>
  )
}

export default BottomNavigation
