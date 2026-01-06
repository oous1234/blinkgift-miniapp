import { CSSProperties } from "react"

const COLORS = {
  bg: "rgba(22, 25, 32, 0.85)",
  accent: "#e8d7fd", // Сиреневый цвет
  pill: "rgba(255, 255, 255, 0.15)", // Фон активной плашки
  border: "rgba(255, 255, 255, 0.08)",
  textMain: "#FFFFFF",
  textSec: "rgba(255, 255, 255, 0.4)",
}

export const BottomNavWrapperStyle: CSSProperties = {
  position: "fixed",
  bottom: "30px",
  left: "0",
  right: "0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "12px",
  zIndex: 1000,
  padding: "0 20px",
  paddingBottom: "safe-area-inset-bottom",
  pointerEvents: "none",
}

// Островок
export const NavMenuStyle: CSSProperties = {
  height: "68px",
  width: "100%",
  maxWidth: "300px", // Фиксированная макс. ширина для корректных расчетов
  backgroundColor: COLORS.bg,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderRadius: "34px",
  border: `1px solid ${COLORS.border}`,
  position: "relative", // Для абсолютного позиционирования слоев
  boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
  pointerEvents: "auto",
  overflow: "hidden", // Чтобы ничего не вылезло за края островка
  touchAction: "none", // Отключаем скролл страницы при свайпе
}

// Кнопка поиска (без изменений)
export const NavSearchButtonStyle: CSSProperties = {
  width: "68px",
  height: "68px",
  borderRadius: "34px",
  backgroundColor: COLORS.bg,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: `1px solid ${COLORS.border}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
  cursor: "pointer",
  color: "#FFFFFF",
  pointerEvents: "auto",
  transition: "transform 0.2s ease",
}

// Слой с иконками (общий стиль для серого и сиреневого слоя)
export const IconsLayerStyle: CSSProperties = {
  display: "flex",
  width: "100%",
  height: "100%",
  position: "absolute",
  top: 0,
  left: 0,
}

// Отдельный айтем внутри слоя
export const NavItemBoxStyle: CSSProperties = {
  flex: 1,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
}

export const NavItemIconBox = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "24px",
  marginBottom: "2px",
}

// Текст иконок
export const NavTextStyle = (isAccent: boolean): CSSProperties => ({
  fontSize: "10px",
  fontWeight: isAccent ? "700" : "500",
  color: isAccent ? COLORS.accent : COLORS.textSec,
  marginTop: "2px",
})

// Стиль самой плашки (фона)
export const PillBackgroundStyle: CSSProperties = {
  backgroundColor: COLORS.pill,
  height: "100%",
  width: "100%",
  borderRadius: "34px", // Такое же скругление как у родителя
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
}
