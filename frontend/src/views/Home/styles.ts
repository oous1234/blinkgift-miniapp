import { CSSProperties } from "react"

const COLORS = {
  bg: "#0F1115",
  cardBg: "#161920",
  cardHighlight: "#1F232E",
  border: "rgba(255, 255, 255, 0.08)",
  textMain: "#FFFFFF",
  textSec: "#9CA3AF",
  accent: "#0098EA", // TON Blue
  accentGlow: "rgba(0, 152, 234, 0.3)",
  success: "#4CAF50",
  danger: "#FF5252",
}

export const WrapperStyle: CSSProperties = {
  minHeight: "100vh",
  backgroundColor: COLORS.bg,
  color: COLORS.textMain,
  padding: "16px",
  paddingBottom: "100px",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
}

// --- Net Worth Card (Premium Look) ---
export const NetWorthCardStyle: CSSProperties = {
  background: `linear-gradient(135deg, ${COLORS.cardBg} 0%, #13161c 100%)`,
  borderRadius: "24px",
  padding: "24px",
  marginBottom: "24px",
  border: `1px solid ${COLORS.border}`,
  position: "relative",
  overflow: "hidden",
  boxShadow: `0 8px 32px -8px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)`,
}

// Эффект свечения для карточки
export const GlowEffectStyle: CSSProperties = {
  position: "absolute",
  top: "-50%",
  right: "-20%",
  width: "200px",
  height: "200px",
  background: COLORS.accent,
  filter: "blur(80px)",
  opacity: 0.15,
  borderRadius: "50%",
  pointerEvents: "none",
}

export const StatLabelStyle: CSSProperties = {
  fontSize: "13px",
  color: COLORS.textSec,
  fontWeight: "500",
}

export const StatValueMainStyle: CSSProperties = {
  fontSize: "42px",
  fontWeight: "800",
  letterSpacing: "-1px",
  color: "white",
  lineHeight: "1.1",
}

// --- Tabs (Segmented Control) ---
export const TabContainerStyle: CSSProperties = {
  display: "flex",
  backgroundColor: "rgba(255,255,255,0.03)",
  padding: "4px",
  borderRadius: "14px",
  marginBottom: "24px",
  border: `1px solid ${COLORS.border}`,
}

export const TabButtonStyle = (isActive: boolean): CSSProperties => ({
  flex: 1,
  padding: "12px",
  borderRadius: "10px",
  backgroundColor: isActive ? COLORS.cardHighlight : "transparent",
  color: isActive ? "#fff" : COLORS.textSec,
  fontWeight: isActive ? "600" : "500",
  fontSize: "14px",
  border: isActive ? `1px solid rgba(255,255,255,0.05)` : "1px solid transparent",
  cursor: "pointer",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
})

// --- Inventory Grid ---
export const GiftCardStyle: CSSProperties = {
  backgroundColor: COLORS.cardBg,
  borderRadius: "18px",
  overflow: "hidden",
  border: `1px solid ${COLORS.border}`,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.1s ease",
}

export const GiftImageContainer: CSSProperties = {
  width: "100%",
  aspectRatio: "1/1",
  background: "radial-gradient(circle at center, #262A35 0%, #1A1D26 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  // ИЗМЕНЕНИЕ 1: Уменьшили отступ с 20px до 10px, чтобы картинка стала крупнее
  padding: "10px",
}

export const GiftImageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover", // или "contain", если картинки должны помещаться целиком без обрезки
  borderRadius: "12px", // Закругленные углы
}

export const GiftInfoContainer: CSSProperties = {
  padding: "12px 14px",
  background: "rgba(255,255,255,0.01)",
}

export const RarityBadgeStyle: CSSProperties = {
  position: "absolute",
  top: "10px",
  left: "10px",
  background: "rgba(0,0,0,0.4)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "6px",
  padding: "4px 8px",
  fontSize: "10px",
  fontWeight: "700",
  color: "rgba(255,255,255,0.9)",
  textTransform: "uppercase",
  zIndex: 2,
}

// --- Stats Section ---
export const StatCardStyle: CSSProperties = {
  backgroundColor: COLORS.cardBg,
  borderRadius: "20px",
  padding: "20px",
  border: `1px solid ${COLORS.border}`,
}

export const ChartPlaceholderStyle: CSSProperties = {
  height: "180px",
  background: "linear-gradient(180deg, rgba(22,25,32,0) 0%, rgba(0,152,234,0.05) 100%)",
  borderRadius: "16px",
  marginBottom: "20px",
  border: "1px dashed rgba(255,255,255,0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
}
