// --- NEW BOTTOM NAV STYLES ---

import { CSSProperties } from "react"

export const BottomNavWrapperStyle: CSSProperties = {
  position: "fixed",
  bottom: "16px",
  left: "0",
  right: "0",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-end",
  gap: "10px",
  zIndex: 100,
  padding: "0 12px",
  paddingBottom: "safe-area-inset-bottom",
  pointerEvents: "none",
}

// Стиль круглой кнопки (Лупа)
export const NavSearchButtonStyle: CSSProperties = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  backgroundColor: "#161920",
  border: "1px solid rgba(255,255,255,0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
  cursor: "pointer",
  color: "white",
  pointerEvents: "auto",
  flexShrink: 0,
}

// Стиль основного прямоугольного меню (Островок)
export const NavMenuStyle: CSSProperties = {
  height: "60px",
  flex: 1,
  maxWidth: "280px", // Уменьшил ширину, так как кнопок стало 3
  padding: "0 6px",
  backgroundColor: "#161920",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
  pointerEvents: "auto",
}
export const PageContentWrapper: CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  paddingBottom: "100px",
  touchAction: "pan-y",
  backgroundColor: "#0F1115", // Добавил фон, чтобы белый текст было видно
}

export const NavItemStyle = (isActive: boolean): CSSProperties => ({
  flex: 1,
  height: "50px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "16px",
  backgroundColor: isActive ? "rgba(255,255,255,0.08)" : "transparent",
  border: "none",
  cursor: "pointer",
  padding: "0",
  transition: "all 0.2s ease",
  gap: "2px",
  // ВАЖНО: Делаем всё белым.
  // Активная кнопка - 100% непрозрачность, неактивная - 50%
  opacity: isActive ? 1 : 0.5,
})

export const NavItemIconBox: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "24px",
}

export const NavItemTextStyle = (isActive: boolean): CSSProperties => ({
  fontSize: "10px",
  fontWeight: isActive ? "600" : "500",
  color: "white", // Текст всегда белый
  letterSpacing: "0.3px",
  transition: "all 0.2s ease",
})