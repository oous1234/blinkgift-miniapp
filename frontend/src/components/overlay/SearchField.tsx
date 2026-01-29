import React from "react"
import { Box, Input, Text, InputProps } from "@chakra-ui/react"
import { ChevronDownIcon } from "@chakra-ui/icons"

interface SearchFieldProps extends InputProps {
  label: string
  isMenu?: boolean
}

export const SearchField: React.FC<SearchFieldProps> = ({ label, isMenu, children, ...props }) => {
  return (
    <Box w="100%">
      <Text
        fontSize="11px"
        fontWeight="800"
        color="gray.500"
        mb="6px"
        ml="4px"
        textTransform="uppercase"
      >
        {label}
      </Text>
      <Box
        position="relative"
        bg="whiteAlpha.50"
        border="1px solid"
        borderColor="whiteAlpha.100"
        borderRadius="14px"
        transition="0.2s"
        _focusWithin={{ borderColor: "brand.500", bg: "whiteAlpha.100" }}
      >
        {isMenu ? (
          children
        ) : (
          <Input
            variant="unstyled"
            p="12px"
            fontSize="16px"
            color="white"
            _placeholder={{ color: "whiteAlpha.300" }}
            {...props}
          />
        )}
        {isMenu && (
          <ChevronDownIcon
            position="absolute"
            right="12px"
            top="50%"
            transform="translateY(-50%)"
            color="whiteAlpha.400"
            pointerEvents="none"
          />
        )}
      </Box>
    </Box>
  )
}