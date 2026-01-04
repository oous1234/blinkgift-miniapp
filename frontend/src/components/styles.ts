import { CSSProperties } from "react"

const COLORS = {
  bg: "rgba(22, 25, 32, 0.8)", // Полупрозрачный темный
  accent: "#e8d7fd",           // Лавандовый из профиля
  border: "rgba(255, 255, 255, 0.08)",
  textMain: "#FFFFFF",
  textSec: "rgba(255, 255, 255, 0.4)",
}

export const BottomNavWrapperStyle: CSSProperties = {
  position: "fixed",
  bottom: "20px",
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

// Контейнер для кнопок (Островок)
export const NavMenuStyle: CSSProperties = {
  height: "64px",
  flex: 1,
  maxWidth: "320px",
  backgroundColor: COLORS.bg,
  backdropFilter: "blur(20px)", // Эффект стекла
  WebkitBackdropFilter: "blur(20px)",
  borderRadius: "24px",
  border: `1px solid ${COLORS.border}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  padding: "0 10px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  pointerEvents: "auto",
}

// Кнопка поиска (Лупа)
export const NavSearchButtonStyle: CSSProperties = {
  width: "64px",
  height: "64px",
  borderRadius: "24px", // Делаем такой же радиус как у меню
  backgroundColor: COLORS.bg,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: `1px solid ${COLORS.border}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  cursor: "pointer",
  color: COLORS.accent,
  pointerEvents: "auto",
  transition: "transform 0.2s ease",
}

export const NavItemStyle = (isActive: boolean): CSSProperties => ({
  flex: 1,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
  position: "relative",
})

export const NavItemIconBox = (isActive: boolean): CSSProperties => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "28px",
  color: isActive ? COLORS.accent : COLORS.textSec,
  transition: "all 0.3s ease",
  transform: isActive ? "translateY(-2px)" : "none",
})

export const NavItemTextStyle = (isActive: boolean): CSSProperties => ({
  fontSize: "10px",
  fontWeight: "700",
  color: isActive ? COLORS.accent : COLORS.textSec,
  marginTop: "2px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
})

// Маленькая точка под активной иконкой
export const ActiveIndicatorStyle: CSSProperties = {
  position: "absolute",
  bottom: "8px",
  width: "4px",
  height: "4px",
  borderRadius: "50%",
  backgroundColor: COLORS.accent,
  boxShadow: `0 0 10px ${COLORS.accent}`,
}

export const SearchOverlayStyle: CSSProperties = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "#161920", // Цвет как у карточек профиля
  zIndex: 2000,
  borderTopLeftRadius: "32px",
  borderTopRightRadius: "32px",
  boxShadow: "0 -10px 40px rgba(0,0,0,0.6)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
}

export const SearchBarContainer: CSSProperties = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  borderRadius: "18px",
  margin: "20px 16px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  height: "52px",
  transition: "all 0.3s ease",
}

export const SearchBackdrop: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  backdropFilter: "blur(10px)",
  zIndex: 1999,
}

export const SearchOptionsButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "0 12px",
  height: "60%",
  borderRight: "1px solid rgba(255, 255, 255, 0.1)",
  color: "#ED2A4A", // Тот самый розовый
  fontSize: "12px",
  fontWeight: "800",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
}

export const SearchInputStyle: CSSProperties = {
  flex: 1,
  backgroundColor: "transparent",
  border: "none",
  outline: "none",
  color: "white",
  padding: "0 16px",
  fontSize: "16px",
  fontWeight: "500",
}

export const SearchResultItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px",
  borderRadius: "16px",
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  marginBottom: "8px",
  cursor: "pointer",
}