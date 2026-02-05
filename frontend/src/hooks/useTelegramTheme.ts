import { useEffect, useState } from "react";
import { useColorMode } from "@chakra-ui/react";

export const useTelegramTheme = () => {
  const { setColorMode } = useColorMode();

  const [themeParams, setThemeParams] = useState(window.Telegram?.WebApp?.themeParams);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (!tg) {
      setColorMode("dark");
      return;
    }

    const syncTheme = () => {
      setThemeParams(tg.themeParams);
      setColorMode(tg.colorScheme || "dark");
    };

    tg.onEvent("themeChanged", syncTheme);

    syncTheme();

    return () => {
      tg.offEvent("themeChanged", syncTheme);
    };
  }, [setColorMode]);

  return {
    isDark: window.Telegram?.WebApp?.colorScheme === "dark",
    params: themeParams,
    accentColor: themeParams?.accent_text_color || "#e8d7fd"
  };
};