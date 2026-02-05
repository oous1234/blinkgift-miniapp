import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

interface SurfaceProps extends BoxProps {
  interactive?: boolean;
}

export const Surface: React.FC<SurfaceProps> = ({ children, interactive, ...props }) => (
  <Box
    bg="whiteAlpha.50"
    borderRadius="24px"
    border="1px solid"
    borderColor="whiteAlpha.100"
    backdropFilter="blur(10px)"
    p={4}
    transition="all 0.2s cubic-bezier(.25,.8,.25,1)"
    _active={interactive ? { transform: "scale(0.98)", bg: "whiteAlpha.100" } : undefined}
    cursor={interactive ? "pointer" : "default"}
    {...props}
  >
    {children}
  </Box>
);