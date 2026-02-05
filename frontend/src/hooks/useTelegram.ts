import { useMemo } from 'react';
import { API_CONFIG } from '../config/constants';

export const useTelegram = () => {
  const tg = window.Telegram?.WebApp;

  const user = useMemo(() => {
    return tg?.initDataUnsafe?.user || {
      id: Number(API_CONFIG.DEFAULT_USER_ID),
      first_name: "Developer",
      username: "dev_user",
    };
  }, [tg]);

  const haptic = useMemo(() => ({
    impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') =>
      tg?.HapticFeedback?.impactOccurred(style),
    notification: (type: 'error' | 'success' | 'warning') =>
      tg?.HapticFeedback?.notificationOccurred(type),
    selection: () =>
      tg?.HapticFeedback?.selectionChanged(),
  }), [tg]);

  return {
    tg,
    user,
    initData: tg?.initData || "",
    haptic,
    isReady: !!tg,
  };
};