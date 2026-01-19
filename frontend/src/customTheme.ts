// src/customTheme.ts
import { extendTheme } from "@chakra-ui/react"

export const customTheme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  fonts: {
    heading: "'Montserrat', sans-serif",
    body: "'Montserrat', sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "#0F1115",
        color: "white",
        margin: 0,
        padding: 0,
        WebkitFontSmoothing: "antialiased",
      },
      // Убираем синие контуры при клике (для мобилок)
      "*:focus": {
        boxShadow: "none !important",
      },
    },
  },
  colors: {
    brand: {
      500: "#e8d7fd",
      600: "#d1b3ff",
    },
    dark: {
      100: "#161920",
      200: "#1F232E",
    },
  },
  components: {
    Button: {
      baseStyle: {
        _active: { transform: "scale(0.98)" },
      },
    },
  },
})
