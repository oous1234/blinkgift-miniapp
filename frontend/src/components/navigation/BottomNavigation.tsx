import React, { useState } from "react"
import { Box } from "@chakra-ui/react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BottomNavWrapperStyle,
  NavSearchButtonStyle,
  NavMenuStyle,
  NavItemStyle,
  NavItemIconBox,
  NavItemTextStyle,
  ActiveIndicatorStyle,
} from "../styles"

interface BottomNavigationProps {
  onSearchOpen: () => void
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onSearchOpen }) => {
  const [activeIndex, setActiveIndex] = useState(0) // Profile по дефолту

  const navItems = [
    {
      id: 0,
      label: "Profile",
      icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    },
    {
      id: 1,
      label: "Market",
      icon: "M3 3v18h18 M18 9l-5 5-4-4-5 5",
    },
    {
      id: 2,
      label: "More",
      icon: "M12 12h.01 M8 12h.01 M16 12h.01",
    },
  ]

  return (
    <Box style={BottomNavWrapperStyle}>
      <Box style={NavMenuStyle}>
        {navItems.map((item) => (
          <button
            key={item.id}
            style={NavItemStyle(activeIndex === item.id)}
            onClick={() => setActiveIndex(item.id)}
          >
            <Box style={NavItemIconBox(activeIndex === item.id)}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={activeIndex === item.id ? "2.5" : "2"}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={item.icon} />
              </svg>
            </Box>
            <span style={NavItemTextStyle(activeIndex === item.id)}>{item.label}</span>
            <AnimatePresence>
              {activeIndex === item.id && (
                <Box as={motion.div} layoutId="nav-dot" style={ActiveIndicatorStyle} />
              )}
            </AnimatePresence>
          </button>
        ))}
      </Box>

      <button
        style={NavSearchButtonStyle}
        onClick={onSearchOpen}
        onPointerDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
        onPointerUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </Box>
  )
}

export default BottomNavigation
