import { extendTheme, type ThemeConfig } from "@chakra-ui/react"

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
}

export const customTheme = extendTheme({
  config,
  fonts: {
    heading: "'Montserrat', sans-serif",
    body: "'Montserrat', sans-serif",
  },
  colors: {
    brand: {
      50: "#f5f0ff",
      100: "#e8d7fd", // Основной светлый акцент
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
      },
      "::-webkit-scrollbar": {
        display: "none",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "18px",
        fontWeight: "900",
        _active: { transform: "scale(0.96)" },
      },
      variants: {
        brand: {
          bg: "brand.500",
          color: "black",
          _hover: { bg: "brand.200" },
        },
        ghost: {
            _hover: { bg: "brand.surface" }
        }
      },
    },
    Drawer: {
      baseStyle: {
        dialog: {
          bg: "brand.bg",
          borderTopRadius: "32px",
        },
      },
    },
  },
})