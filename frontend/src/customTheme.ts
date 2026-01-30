import { extendTheme, type ThemeConfig } from "@chakra-ui/react"

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
}

export const customTheme = extendTheme({
  config,
  fonts: {
    // Roboto + системные шрифты как в твоем CSS
    heading: "Roboto, system-ui, sans-serif",
    body: "Roboto, system-ui, sans-serif",
  },
  colors: {
    brand: {
      50: "#f5f0ff",
      100: "#e8d7fd",
      200: "#d1b3ff",
      500: "#e8d7fd",
      bg: "#0F1115",
      card: "#161920",
      surface: "rgba(255, 255, 255, 0.05)",
    },
    ton: "#0088CC",
  },
  styles: {
    global: {
      body: {
        bg: "brand.bg",
        color: "white",
        WebkitTapHighlightColor: "transparent",
        // Настройки из твоего фрагмента
        fontSize: "14px",
        lineHeight: "16px",
        // Оптимизация отображения шрифта
        textRendering: "optimizeLegibility",
        WebkitFontSmoothing: "antialiased",
      },
      "::-webkit-scrollbar": {
        display: "none",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        // Умеренные скругления, характерные для Roboto-интерфейсов
        borderRadius: "12px",
        fontWeight: "500", // Roboto лучше всего выглядит на 500 весах в кнопках
        _active: { transform: "scale(0.97)" },
      },
      variants: {
        brand: {
          bg: "brand.500",
          color: "black",
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: "700",
      },
    },
    Drawer: {
      baseStyle: {
        dialog: {
          bg: "brand.bg",
          borderTopRadius: "20px",
        },
      },
    },
  },
})