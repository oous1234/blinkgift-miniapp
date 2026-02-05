import React from "react"
import { Box, BoxProps } from "@chakra-ui/react"

export const Card: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box
    bg="whiteAlpha.50"
    borderRadius="24px"
    border="1px solid"
    borderColor="whiteAlpha.100"
    p={4}
    transition="all 0.2s cubic-bezier(.25,.8,.25,1)"
    _active={{ transform: "scale(0.98)" }}
    {...props}
  >
    {children}
  </Box>
)