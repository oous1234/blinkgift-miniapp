import React, { useState } from "react"
import { Box, Text } from "@chakra-ui/react"
import { motion, PanInfo, useAnimation } from "framer-motion"
import {
  BottomNavWrapperStyle,
  NavSearchButtonStyle,
  NavMenuStyle,
  NavItemStyle,
  NavItemIconBox,
  NavItemTextStyle,
} from "./styles"

// Количество вкладок (важно для ширины контейнера)
const TABS = ["Profile", "Market", "More"]

const MainLayout: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  // Контроллер анимации, чтобы программно двигать слайдер (например, при клике на кнопки)
  const controls = useAnimation()

  // --- ЛОГИКА СВАЙПА 1-в-1 ---
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info
    const swipeConfidenceThreshold = 10000 // Порог силы свайпа
    const swipePower = Math.abs(offset.x) * velocity.x

    // Если свайпнули достаточно сильно влево
    if (swipePower < -swipeConfidenceThreshold) {
      if (activeIndex < TABS.length - 1) {
        setActiveIndex((prev) => prev + 1)
      }
    }
    // Если свайпнули достаточно сильно вправо
    else if (swipePower > swipeConfidenceThreshold) {
      if (activeIndex > 0) {
        setActiveIndex((prev) => prev - 1)
      }
    }
    // Если просто немного потянули, но не свайпнули - вернется само благодаря animate
  }

  // --- РЕНДЕР КОНТЕНТА ---
  const renderPage = (index: number) => {
    switch (index) {
      case 0: return <Box h="100%" bg="gray.900" p={10}><Text fontSize="2xl" color="white">👤 Профиль (Потяни влево)</Text></Box>
      case 1: return <Box h="100%" bg="blue.900" p={10}><Text fontSize="2xl" color="white">📈 Маркет (Тяни в стороны)</Text></Box>
      case 2: return <Box h="100%" bg="purple.900" p={10}><Text fontSize="2xl" color="white">⚙️ Еще (Потяни вправо)</Text></Box>
      default: return null
    }
  }

  return (
    <Box
      // Обертка экрана: скрываем всё, что вылезает за пределы
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      {/*
         СЛАЙДЕР (ЛЕНТА)
         Ширина = 100% * количество вкладок.
         Мы двигаем эту ленту целиком.
      */}
      <motion.div
        drag="x" // Разрешаем тянуть по горизонтали
        dragConstraints={{ left: 0, right: 0 }} // Хак: не дает улететь ленте, но позволяет пружинить
        dragElastic={0.2} // Эффект резинки при перетягивании краев
        onDragEnd={handleDragEnd}
        // Анимация привязывается к активному индексу
        // -100% * index сдвигает ленту на нужный экран
        animate={{ x: `-${activeIndex * 100}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }} // Физика пружины для плавности
        style={{
          display: "flex", // Выстраиваем страницы в ряд
          width: `${TABS.length * 100}%`, // 300% ширины для 3 вкладок
          height: "100%",
        }}
      >
        {/* Рендерим все страницы сразу в одну линию */}
        {TABS.map((_, index) => (
          <Box
            key={index}
            style={{
              width: "100%", // Каждая страница занимает 1 экран
              height: "100%",
              flexShrink: 0, // Запрещаем сжиматься
            }}
          >
            {renderPage(index)}
          </Box>
        ))}
      </motion.div>

      {/* --- НИЖНЕЕ МЕНЮ --- */}
      <Box style={BottomNavWrapperStyle}>
        <Box style={NavMenuStyle}>
          <NavButton
            label="Profile"
            iconPath="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
            isActive={activeIndex === 0}
            onClick={() => setActiveIndex(0)}
          />
          <NavButton
            label="Market"
            iconPath="M3 3v18h18 M18 9l-5 5-4-4-5 5"
            isActive={activeIndex === 1}
            onClick={() => setActiveIndex(1)}
          />
          <NavButton
            label="More"
            iconPath="M12 5v.01 M12 12v.01 M12 19v.01 M12 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
            isActive={activeIndex === 2}
            onClick={() => setActiveIndex(2)}
          />
        </Box>

        <button style={NavSearchButtonStyle}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </Box>
    </Box>
  )
}

const NavButton = ({ label, iconPath, isActive, onClick }: any) => (
  <button style={NavItemStyle(isActive)} onClick={onClick}>
    <div style={NavItemIconBox}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={isActive ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
        <path d={iconPath} />
      </svg>
    </div>
    <span style={NavItemTextStyle(isActive)}>{label}</span>
  </button>
)

export default MainLayout