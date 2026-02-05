export const haptic = {
  impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style)
  },
  notification: (type: 'error' | 'success' | 'warning') => {
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type)
  },
  selection: () => {
    window.Telegram?.WebApp?.HapticFeedback?.selectionChanged()
  }
}