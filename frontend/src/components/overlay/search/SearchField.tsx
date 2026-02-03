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
        fontSize="10px"
        fontWeight="900"
        color="whiteAlpha.300"
        mb="6px"
        ml="2px"
        textTransform="uppercase"
        letterSpacing="0.5px"
      >
        {label}
      </Text>
      <Flex
        position="relative"
        bg="rgba(255, 255, 255, 0.04)"
        borderRadius="16px"
        transition="all 0.2s"
        align="center"
        border="1px solid"
        borderColor="whiteAlpha.50"
        _focusWithin={{
          borderColor: "brand.500",
          bg: "rgba(255, 255, 255, 0.07)"
        }}
        cursor={isMenu ? "pointer" : "text"}
      >
        {isMenu ? (
          <Box w="100%" h="44px" display="flex" alignItems="center">
            {children}
          </Box>
        ) : (
          <Input
            variant="unstyled"
            px="14px"
            h="44px"
            fontSize="14px"
            fontWeight="700"
            color="white"
            _placeholder={{ color: "whiteAlpha.200" }}
            {...props}
          />
        )}
        {isMenu && (
          <Box pr="10px">
            <ChevronDownIcon color="whiteAlpha.300" boxSize="18px" />
          </Box>
        )}
        {rightElement && <Box pr="10px">{rightElement}</Box>}
      </Flex>
    </Box>
  )
}