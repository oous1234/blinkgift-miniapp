import React, { useState, useRef, useEffect } from "react"
import { Box } from "@chakra-ui/react"
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  PanInfo,
  TapInfo
} from "framer-motion"
import {
  BottomNavWrapperStyle,
  NavSearchButtonStyle,
  NavMenuStyle,
  IconsLayerStyle,
  NavItemBoxStyle,
  NavItemIconBox,
  NavTextStyle
} from "../styles"

interface BottomNavigationProps {
  onSearchOpen: () => void
}

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

// Компонент ряда иконок
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
  const [activeIndex, setActiveIndex] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)

  // X координата маски (плашки)
  const maskX = useMotionValue(0)
  // Обратная X координата для контента
  const contentX = useTransform(maskX, (x) => -x)

  const [menuWidth, setMenuWidth] = useState(0)
  // Вычисляем ширину одного элемента только когда известна ширина меню
  const itemWidth = menuWidth > 0 ? menuWidth / 3 : 0

  useEffect(() => {
    if (menuRef.current) {
      setMenuWidth(menuRef.current.offsetWidth)
    }
  }, [])

  // Анимация перехода (Snap)
  const snapTo = (index: number) => {
    if (!itemWidth) return

    const targetX = index * itemWidth

    // Запускаем плавную анимацию перемещения
    animate(maskX, targetX, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    })

    setActiveIndex(index)

    // Haptic feedback
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
    // Предсказание остановки
    const predictedX = currentX + velocity * 0.2

    const nextIndex = Math.round(predictedX / itemWidth)
    const clampedIndex = Math.max(0, Math.min(nextIndex, 2))

    snapTo(clampedIndex)
  }

  // --- НОВОЕ: Обработка клика (Tap) ---
  const handleTap = (event: MouseEvent, info: TapInfo) => {
    if (!menuRef.current || !itemWidth) return

    const rect = menuRef.current.getBoundingClientRect()
    // Вычисляем, куда именно нажал пользователь относительно левого края меню
    const tapX = info.point.x - rect.left

    // Определяем индекс (0, 1 или 2)
    const clickedIndex = Math.floor(tapX / itemWidth)
    const clampedIndex = Math.max(0, Math.min(clickedIndex, 2))

    snapTo(clampedIndex)
  }

  return (
    <Box style={BottomNavWrapperStyle}>
      {/* ОСТРОВОК */}
      <Box
        ref={menuRef}
        style={NavMenuStyle}
      >
        {/* СЛОЙ 1: Серые иконки (Фон) */}
        <IconsRow color="rgba(255, 255, 255, 0.4)" />

        {/* СЛОЙ 2: Маска (Плашка) */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '33.333%',
            height: '100%',
            x: maskX,
            overflow: 'hidden',
            borderRadius: '34px',
            zIndex: 5,
            pointerEvents: 'none'
          }}
        >
          {/* Полупрозрачный фон плашки */}
          <div style={{
            position: 'absolute', inset: '4px', borderRadius: '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }} />

          {/* СЛОЙ 3: Сиреневые иконки (внутри маски) */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '300%', // 300% ширины, так как родитель 1/3
              height: '100%',
              x: contentX // Движение в противофазе
            }}
          >
            <IconsRow color="#e8d7fd" />
          </motion.div>
        </motion.div>

        {/* СЛОЙ 4: Сенсорный слой (Жесты + Клики) */}
        {/* Он лежит поверх всего и ловит все касания */}
        <motion.div
          style={{
            position: 'absolute', inset: 0, zIndex: 20, cursor: 'pointer'
          }}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
          onTap={handleTap} // Добавили обработчик тапа
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