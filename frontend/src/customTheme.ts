import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

export const customTheme = extendTheme({
  config,
  fonts: {
    heading: "'Roboto', system-ui, sans-serif",
    body: "'Roboto', system-ui, sans-serif",
  },
  colors: {
    brand: {
      50: "#f5f0ff",
      100: "#e8d7fd",
      200: "#d1b3ff",
      500: "#e8d7fd",
      bg: "#0F1115",
      surface: "rgba(255, 255, 255, 0.04)",
      border: "rgba(255, 255, 255, 0.08)",
    },
  },
  styles: {
    global: {
      body: {
        bg: "brand.bg",
        color: "white",
        fontSize: "14px",
        userSelect: "none",
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
        borderRadius: "16px",
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        transition: "all 0.2s cubic-bezier(.25,.8,.25,1)",
        _active: { transform: "scale(0.96)" },
      },
      variants: {
        solid: {
          bg: "whiteAlpha.100",
          _hover: { bg: "whiteAlpha.200" },
        },
        brand: {
          bg: "brand.500",
          color: "brand.bg",
          _hover: { bg: "brand.100" },
        },
      },
    },
    Drawer: {
      baseStyle: {
        dialog: {
          bg: "brand.bg",
          borderTopRadius: "32px",
          boxShadow: "0 -10px 40px rgba(0,0,0,0.5)",
        },
      },
    },
  },
});