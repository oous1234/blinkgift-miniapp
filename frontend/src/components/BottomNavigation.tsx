import React, { useState } from "react"
import { Box, Text } from "@chakra-ui/react"
import { motion, PanInfo } from "framer-motion"
import {
  BottomNavWrapperStyle,
  NavSearchButtonStyle,
  NavMenuStyle,
  NavItemStyle,
  NavItemIconBox,
  NavItemTextStyle,
} from "./styles"

// Количество вкладок
const TABS = ["Profile", "Market", "More"]

const MainLayout: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(1) // Начнем с Market (центр), для примера

  // --- ЛОГИКА СВАЙПА ---
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info
    const swipeConfidenceThreshold = 10000 // Порог свайпа с инерцией
    const pixelThreshold = 100 // Порог свайпа в пикселях (если тянем медленно)

    const swipePower = Math.abs(offset.x) * velocity.x

    // 1. Свайп ВЛЕВО (идем к следующей вкладке)
    // Либо сильный бросок, либо перетащили больше чем на 100px
    if (swipePower < -swipeConfidenceThreshold || offset.x < -pixelThreshold) {
      if (activeIndex < TABS.length - 1) {
        setActiveIndex((prev) => prev + 1)
      }
    }
    // 2. Свайп ВПРАВО (идем к предыдущей вкладке)
    else if (swipePower > swipeConfidenceThreshold || offset.x > pixelThreshold) {
      if (activeIndex > 0) {
        setActiveIndex((prev) => prev - 1)
      }
    }
    // В противном случае animate сам вернет слайд на место
  }

  // Вычисляем эластичность (сопротивление), чтобы нельзя было утянуть за пределы краев
  // Если мы на первом слайде (index 0) - запрещаем тянуть вправо (right: 0.1)
  // Если мы на последнем слайде - запрещаем тянуть влево (left: 0.1)
  const dragElastic = {
    top: 0,
    bottom: 0,
    left: activeIndex === TABS.length - 1 ? 0.05 : 1, // Сопротивление слева
    right: activeIndex === 0 ? 0.05 : 1, // Сопротивление справа
  }

  return (
    <Box
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {/* 
        СЛАЙДЕР 
      */}
      <motion.div
        drag="x" // Разрешаем тянуть
        // dragConstraints={{ left: 0, right: 0 }} заставляет слайд возвращаться в "центр" (текущий index),
        // когда мы отпускаем палец.
        dragConstraints={{ left: 0, right: 0 }}
        // КЛЮЧЕВОЙ МОМЕНТ: elastic={1} дает ощущение 1-в-1 движения за пальцем
        dragElastic={dragElastic}
        // Отключаем инерцию, чтобы слайд не скользил как по льду, а четко слушался пальца
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        // Перемещение контейнера к активному слайду
        animate={{ x: `-${activeIndex * 100}%` }}
        // Настройки пружины для приятного "щелчка" при смене слайда
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
        style={{
          display: "flex",
          width: `${TABS.length * 100}%`, // 300% ширины
          height: "100%",
          cursor: "grab",
        }}
        whileTap={{ cursor: "grabbing" }}
      >
        {/* Страницы */}
        <Page color="gray.900" title="👤 Profile" subtitle="Тяни влево ->" />
        <Page color="blue.900" title="📈 Market" subtitle="<- Тяни в стороны ->" />
        <Page color="purple.900" title="⚙️ More" subtitle="<- Тяни вправо" />
      </motion.div>

      {/* --- НИЖНЕЕ МЕНЮ (Интегрировано) --- */}
      <BottomNavigation activeIndex={activeIndex} onChange={setActiveIndex} />
    </Box>
  )
}

// Компонент одной страницы
const Page = ({ color, title, subtitle }: any) => (
  <Box
    bg={color}
    w="100%"
    h="100%"
    flexShrink={0}
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    p={6}
  >
    <Text fontSize="4xl" fontWeight="bold" color="white" mb={4}>
      {title}
    </Text>
    <Text fontSize="lg" color="whiteAlpha.700">
      {subtitle}
    </Text>
  </Box>
)

// Компонент навигации
const BottomNavigation = ({
  activeIndex,
  onChange,
}: {
  activeIndex: number
  onChange: (i: number) => void
}) => {
  return (
    <Box style={BottomNavWrapperStyle}>
      <Box style={NavMenuStyle}>
        <NavButton
          label="Market"
          iconPath="M3 3v18h18 M18 9l-5 5-4-4-5 5"
          isActive={activeIndex === 1} // Индексы: 0-Profile, 1-Market, 2-More (как в массиве TABS)
          // В массиве: ["Profile", "Market", "More"], но в UI ты хотел Market первым в списке?
          // Если порядок кнопок важен, просто передавай правильный индекс:
          // Допустим: Profile=0, Market=1, More=2
          onClick={() => onChange(1)}
        />
        <NavButton
          label="Profile"
          iconPath="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
          isActive={activeIndex === 0}
          onClick={() => onChange(0)}
        />
        <NavButton
          label="More"
          iconPath="M12 5v.01 M12 12v.01 M12 19v.01 M12 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
          isActive={activeIndex === 2}
          onClick={() => onChange(2)}
        />
      </Box>

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

export default MainLayout
