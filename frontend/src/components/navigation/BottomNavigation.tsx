import React from "react"
import { Box, Flex } from "@chakra-ui/react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { HOME, MARKET } from "../../router/paths"
import { UserIcon, MarketIcon, TradeIcon, SearchIconSolid } from "../Shared/Icons"

interface BottomNavigationProps {
  onSearchOpen: () => void
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onSearchOpen }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { id: 0, path: HOME, icon: UserIcon, type: "link" },
    { id: 1, path: MARKET, icon: MarketIcon, type: "link" },
    { id: 2, path: "/trade", icon: TradeIcon, type: "link" },
    { id: 3, path: "search", icon: SearchIconSolid, type: "action" },
  ]

  const activeIndex = navItems.findIndex(
    (item) =>
      item.type === "link" &&
      (item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path))
  )

  const handleItemClick = (item: (typeof navItems)[0]) => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.selectionChanged()
    }
    if (item.type === "action" && item.id === 3) {
      onSearchOpen()
    } else if (item.path) {
      navigate(item.path)
    }
  }

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex={1000}
      bg="rgba(24, 26, 30, 0.7)"
      backdropFilter="blur(20px) saturate(160%)"
      borderTopRadius="28px"
      borderTop="1px solid"
      borderColor="whiteAlpha.100"
      boxShadow="0 -8px 32px rgba(0,0,0,0.4)"
      pb="safe-area-inset-bottom"
    >
      <Flex height="75px" align="center" justify="space-around" px={2}>
        {navItems.map((item) => {
          const isActive = item.type === "link" && activeIndex === item.id
          const IconComp = item.icon

          return (
            <Flex
              key={item.id}
              flex={1}
              direction="column"
              align="center"
              justify="center"
              position="relative"
              cursor="pointer"
              height="100%"
              onClick={() => handleItemClick(item)}
              _active={{ transform: "scale(0.95)" }}
              transition="transform 0.1s ease"
            >
              {/* Эффект свечения под иконкой (опционально, для усиления яркости) */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    style={{
                      position: "absolute",
                      width: "40px",
                      height: "40px",
                      background: "rgba(255, 255, 255, 0.15)",
                      filter: "blur(15px)",
                      borderRadius: "50%",
                      zIndex: 0,
                    }}
                  />
                )}
              </AnimatePresence>

              <IconComp
                boxSize="26px"
                zIndex={1}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                // Когда иконка активна: чисто белый цвет, когда нет — тусклый
                color={isActive ? "#FFFFFF" : "whiteAlpha.400"}
                // Главный эффект: свечение за края иконки
                filter={
                  isActive
                    ? "drop-shadow(0 0 8px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 12px rgba(255, 255, 255, 0.4))"
                    : "none"
                }
                // Небольшое увеличение активной иконки
                transform={isActive ? "scale(1.15)" : "scale(1)"}
              />

              {/* Маленькая точка под активной иконкой для акцента */}
              {isActive && (
                <motion.div
                  layoutId="activeDot"
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    width: "4px",
                    height: "4px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    boxShadow: "0 0 10px white",
                  }}
                />
              )}
            </Flex>
          )
        })}
      </Flex>
    </Box>
  )
}

export default BottomNavigation
