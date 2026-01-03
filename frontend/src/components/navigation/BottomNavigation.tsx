import React, { useState } from "react"
import { Box } from "@chakra-ui/react"
import {
  BottomNavWrapperStyle,
  NavSearchButtonStyle,
  NavMenuStyle,
  NavItemStyle,
  NavItemIconBox,
  NavItemTextStyle,
} from "../styles"

const BottomNavigation = () => {
  // Состояние для подсветки активной кнопки.
  // 0 = Profile, 1 = Market, 2 = More
  const [activeIndex, setActiveIndex] = useState(1)

  return (
      <Box style={BottomNavWrapperStyle}>
        {/* Основной блок меню (Островок) */}
        <Box style={NavMenuStyle}>
          <NavButton
              label="Market"
              iconPath="M3 3v18h18 M18 9l-5 5-4-4-5 5"
              isActive={activeIndex === 1}
              onClick={() => setActiveIndex(1)}
          />
          <NavButton
              label="Profile"
              iconPath="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
              isActive={activeIndex === 0}
              onClick={() => setActiveIndex(0)}
          />
          <NavButton
              label="More"
              iconPath="M12 5v.01 M12 12v.01 M12 19v.01 M12 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
              isActive={activeIndex === 2}
              onClick={() => setActiveIndex(2)}
          />
        </Box>

        {/* Круглая кнопка поиска справа */}
        <button style={NavSearchButtonStyle}>
          <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
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

// Вспомогательный компонент кнопки
const NavButton = ({ label, iconPath, isActive, onClick }: any) => (
    <button style={NavItemStyle(isActive)} onClick={onClick}>
      <div style={NavItemIconBox}>
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={isActive ? "2.5" : "2"}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
          <path d={iconPath} />
        </svg>
      </div>
      <span style={NavItemTextStyle(isActive)}>{label}</span>
    </button>
)

export default BottomNavigation