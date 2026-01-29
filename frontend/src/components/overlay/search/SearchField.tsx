import React from "react"
import { Box, Input, Text, InputProps, Flex } from "@chakra-ui/react"
import { ChevronDownIcon } from "@chakra-ui/icons"

interface SearchFieldProps extends InputProps {
  label: string
  isMenu?: boolean
  rightElement?: React.ReactNode
}

export const SearchField: React.FC<SearchFieldProps> = ({
  label,
  isMenu,
  children,
  rightElement,
  ...props
}) => {
  return (
    <Box w="100%">
      <Text
        fontSize="11px"
        fontWeight="800"
        color="whiteAlpha.500"
        mb="6px"
        ml="4px"
        textTransform="uppercase"
        letterSpacing="0.5px"
      >
        {label}
      </Text>
      <Flex
        position="relative"
        bg="whiteAlpha.50"
        border="1px solid"
        borderColor="whiteAlpha.100"
        borderRadius="16px"
        transition="all 0.2s"
        align="center"
        _focusWithin={{ borderColor: "brand.500", bg: "whiteAlpha.100" }}
        cursor={isMenu ? "pointer" : "text"}
      >
        {isMenu ? (
          <Box w="100%">{children}</Box>
        ) : (
          <Input
            variant="unstyled"
            p="14px"
            fontSize="15px"
            fontWeight="600"
            color="white"
            _placeholder={{ color: "whiteAlpha.300" }}
            {...props}
          />
        )}

        {isMenu && (
          <Box pr="12px">
            <ChevronDownIcon color="whiteAlpha.400" boxSize="20px" />
          </Box>
        )}
        {rightElement && <Box pr="12px">{rightElement}</Box>}
      </Flex>
    </Box>
  )
}