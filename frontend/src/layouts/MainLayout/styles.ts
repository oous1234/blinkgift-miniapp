import { CSSProperties } from "react"

// --- Global Theme Constants ---
const COLORS = {
  bg: "#111318", // Очень темный, почти черный (как в Telegram/Wallet)
  surface: "#1F232E", // Карточки
  surfaceHighlight: "#2D3442",
  accent: "#0088CC", // Telegram Blue или бренд цвет
  textPrimary: "#FFFFFF",
  textSecondary: "#9CA3AF",
  success: "#4ADE80",
  danger: "#F87171",
  border: "rgba(255, 255, 255, 0.08)",
}

export const WrapperStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  width: "100%",
  backgroundColor: COLORS.bg,
  color: COLORS.textPrimary,
  overflow: "hidden", // Скролл будет внутри контента
}

// --- Header ---
export const HeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  height: "64px",
  backgroundColor: "rgba(17, 19, 24, 0.85)", // Полупрозрачность
  backdropFilter: "blur(12px)", // Эффект стекла
  borderBottom: `1px solid ${COLORS.border}`,
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
}

export const HeaderLeftSection: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
}

export const HeaderRightSection: CSSProperties = {
  display: "flex",
  alignItems: "center",
  // gap убираем, так как теперь у нас один общий контейнер
}

export const OvalButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
  borderRadius: "50%", // Круглые кнопки внутри овала
  backgroundColor: "transparent",
  cursor: "pointer",
  transition: "all 0.2s ease",
  border: "none",
  outline: "none",
}

// 3. Вертикальная черточка-разделитель между кнопками
export const SeparatorStyle: CSSProperties = {
  width: "1px",
  height: "16px",
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  margin: "0 2px",
}

export const HeaderActionsContainerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "rgba(255, 255, 255, 0.08)", // Полупрозрачный фон
  borderRadius: "100px", // Полный овал
  padding: "4px", // Внутренний отступ
  border: `1px solid rgba(255, 255, 255, 0.1)`, // Тонкая обводка
  backdropFilter: "blur(10px)",
}

export const AvatarStyle: CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  objectFit: "cover",
  border: `2px solid ${COLORS.surfaceHighlight}`,
}

export const HeaderNameStyle: CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: "1.2",
  color: COLORS.textPrimary,
}

export const HeaderTagStyle: CSSProperties = {
  fontSize: "12px",
  color: COLORS.textSecondary,
  lineHeight: "1",
}

export const IconButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  backgroundColor: "transparent",
  cursor: "pointer",
  transition: "background 0.2s",
  // Иконки будут белыми
  color: "#FFF",
}

// --- Content Wrapper ---
export const ChildrenWrapperStyle: CSSProperties = {
  flex: 1,
  marginTop: "64px", // Отступ под фиксированный хедер
  overflowY: "auto",
  paddingBottom: "80px", // Отступ под MainButton телеграма если есть
  scrollbarWidth: "none", // Скрыть скроллбар
}

// --- Shared Styles for Profile Cards ---
export const CardStyle: CSSProperties = {
  backgroundColor: COLORS.surface,
  borderRadius: "16px",
  padding: "16px",
  marginBottom: "12px",
  border: `1px solid ${COLORS.border}`,
}
