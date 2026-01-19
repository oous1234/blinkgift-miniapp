import React, { useState, useRef, useEffect, useCallback } from "react"
import { Box } from "@chakra-ui/react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, useMotionValue, useTransform, animate, PanInfo, TapInfo } from "framer-motion"
import { HOME, MARKET } from "@router/paths" // Убедитесь, что MARKET добавлен в paths.ts
import {
  BottomNavWrapperStyle,
  NavSearchButtonStyle,
  NavMenuStyle,
  IconsLayerStyle,
  NavItemBoxStyle,
  NavItemIconBox,
  NavTextStyle,
} from "../styles"

interface BottomNavigationProps {
  onSearchOpen: () => void
}

const navItems = [
  {
    id: 0,
    label: "Profile",
    path: HOME,
    icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  },
  {
    id: 1,
    label: "Market",
    path: "/market", // MARKET path
    icon: "M3 3v18h18 M18 9l-5 5-4-4-5 5",
  },
  {
    id: 2,
    label: "More",
    path: "/more",
    icon: "M12 12h.01 M8 12h.01 M16 12h.01",
  },
]

// Компонент ряда иконок (Слой)
const IconsRow = ({ color }: { color: string }) => (
  <div style={IconsLayerStyle}>
    {navItems.map((item) => (
      <div key={item.id} style={NavItemBoxStyle}>
        <div style={{ ...NavItemIconBox, color }}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={color === "#e8d7fd" ? "2.5" : "2"}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={item.icon} />
          </svg>
        </div>
        <span style={NavTextStyle(color === "#e8d7fd")}>{item.label}</span>
      </div>
    ))}
  </div>
)

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onSearchOpen }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const menuRef = useRef<HTMLDivElement>(null)

  const [menuWidth, setMenuWidth] = useState(0)
  const itemWidth = menuWidth > 0 ? menuWidth / 3 : 0

  // Текущий индекс на основе URL
  const getIndexFromPath = useCallback((path: string) => {
    if (path === MARKET) return 1
    if (path.startsWith("/more")) return 2
    return 0 // По умолчанию Profile
  }, [])

  const [activeIndex, setActiveIndex] = useState(getIndexFromPath(location.pathname))

  // X координата маски (плашки)
  const maskX = useMotionValue(activeIndex * itemWidth)
  // Обратная X координата для контента внутри маски
  const contentX = useTransform(maskX, (x) => -x)

  // Обновляем ширину меню при монтировании
  useEffect(() => {
    if (menuRef.current) {
      const width = menuRef.current.offsetWidth
      setMenuWidth(width)
      // Сразу ставим маску в нужное место после получения ширины
      maskX.set(activeIndex * (width / 3))
    }
  }, [activeIndex, maskX])

  // Синхронизация слайдера, если путь изменился извне (например, кнопкой назад)
  useEffect(() => {
    const newIndex = getIndexFromPath(location.pathname)
    if (newIndex !== activeIndex && itemWidth > 0) {
      setActiveIndex(newIndex)
      animate(maskX, newIndex * itemWidth, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      })
    }
  }, [location.pathname, activeIndex, itemWidth, maskX, getIndexFromPath])

  const snapTo = (index: number) => {
    if (!itemWidth) return

    const targetX = index * itemWidth

    animate(maskX, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    })

    setActiveIndex(index)

    // Выполняем переход по роуту
    const targetPath = navItems[index].path
    if (location.pathname !== targetPath) {
      navigate(targetPath)
    }

    // Haptic feedback Telegram
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.selectionChanged()
    }
  }

  // Свайп (Drag)
  const handlePan = (event: any, info: PanInfo) => {
    if (!itemWidth) return
    const newX = activeIndex * itemWidth + info.offset.x
    // Ограничиваем движение рамками меню
    if (newX >= 0 && newX <= menuWidth - itemWidth) {
      maskX.set(newX)
    }
  }

  const handlePanEnd = (event: any, info: PanInfo) => {
    if (!itemWidth) return
    const currentX = maskX.get()
    const velocity = info.velocity.x
    const predictedX = currentX + velocity * 0.2

    const nextIndex = Math.round(predictedX / itemWidth)
    const clampedIndex = Math.max(0, Math.min(nextIndex, 2))

    snapTo(clampedIndex)
  }

  // Обработка клика (Tap)
  const handleTap = (event: MouseEvent, info: TapInfo) => {
    if (!menuRef.current || !itemWidth) return

    const rect = menuRef.current.getBoundingClientRect()
    const tapX = info.point.x - rect.left

    const clickedIndex = Math.floor(tapX / itemWidth)
    const clampedIndex = Math.max(0, Math.min(clickedIndex, 2))

    snapTo(clampedIndex)
  }

  return (
    <Box style={BottomNavWrapperStyle}>
      {/* ОСТРОВОК НАВИГАЦИИ */}
      <Box ref={menuRef} style={NavMenuStyle}>
        {/* СЛОЙ 1: Неактивные (серые) иконки */}
        <IconsRow color="rgba(255, 255, 255, 0.4)" />

        {/* СЛОЙ 2: Маска (Активная плашка) */}
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "33.333%",
            height: "100%",
            x: maskX,
            overflow: "hidden",
            borderRadius: "34px",
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          {/* Фон плашки */}
          <div
            style={{
              position: "absolute",
              inset: "4px",
              borderRadius: "30px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
          />

          {/* СЛОЙ 3: Активные (сиреневые) иконки, движущиеся в противофазе */}
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "300%",
              height: "100%",
              x: contentX,
            }}
          >
            <IconsRow color="#e8d7fd" />
          </motion.div>
        </motion.div>

        {/* СЛОЙ 4: Сенсорная панель */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            cursor: "pointer",
          }}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
          onTap={handleTap}
        />
      </Box>

      {/* Кнопка поиска */}
      <button
        style={NavSearchButtonStyle}
        onClick={onSearchOpen}
        onPointerDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
        onPointerUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onPointerLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
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

export default BottomNavigation
