import { CSSProperties } from "react"

const COLORS = {
  bg: "#0F1115", // Основной фон профиля
  accent: "#e8d7fd",
  textPrimary: "#FFFFFF",
  textSecondary: "#9CA3AF",
}

export const WrapperStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh", // Теперь скроллится всё приложение целиком
  width: "100%",
  backgroundColor: COLORS.bg,
  color: COLORS.textPrimary,
  overflowY: "auto", // Скролл на внешнем контейнере
}

export const HeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
  height: "64px",
  backgroundColor: "transparent", // Фона нет, используется фон WrapperStyle
  position: "relative", // Шапка теперь в общем потоке и уходит при скролле
  zIndex: 100,
}

export const HeaderLeftSection: CSSProperties = {
  display: "flex",
  alignItems: "center",
  flex: 1,
}

export const HeaderCenterSection: CSSProperties = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "#e8d7fd",
  padding: "6px 18px",
  borderRadius: "100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}

export const HeaderTitleStyle: CSSProperties = {
  fontSize: "13px",
  fontWeight: "800",
  color: "#FFFFFF", // Белый текст, как ты просил
  textTransform: "uppercase",
  letterSpacing: "0.8px",
}

export const HeaderRightSection: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  flex: 1,
}

export const HeaderActionsContainerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  borderRadius: "14px",
  padding: "2px",
}

export const OvalButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  borderRadius: "10px",
  cursor: "pointer",
  border: "none",
}

export const SeparatorStyle: CSSProperties = {
  width: "1px",
  height: "12px",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
}

export const AvatarStyle: CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
}

export const ChildrenWrapperStyle: CSSProperties = {
  flex: 1,
  paddingBottom: "100px", // Место под нижнюю навигацию
  // marginTop удален, так как шапка больше не перекрывает контент
}
