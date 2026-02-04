// frontend/src/components/overlay/search/AttributePicker.tsx
import React, { useState } from "react"
import {
  Box, SimpleGrid, Text, Input, VStack, Center, Spinner,
  InputGroup, InputLeftElement, IconButton, HStack, Image
} from "@chakra-ui/react"
import { SearchIcon, ArrowBackIcon, CheckIcon } from "@chakra-ui/icons"

interface AttributePickerProps {
  title: string
  items: any[]
  onSelect: (item: any) => void
  onBack: () => void
  getImageUrl?: (item: any) => string
  renderCustomItem?: (item: any) => React.ReactNode
  isLoading?: boolean
  selectedItems?: string[] // Добавлено для подсветки
}

export const AttributePicker: React.FC<AttributePickerProps> = ({
  title,
  items,
  onSelect,
  onBack,
  getImageUrl,
  renderCustomItem,
  isLoading,
  selectedItems = []
}) => {
  const [search, setSearch] = useState("")
  const filtered = items.filter((i) => {
    const name = typeof i === "string" ? i : (i.name || "")
    return name?.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <VStack spacing={4} align="stretch" h="100%">
      <HStack spacing={4} px={2} pt={2}>
        <IconButton
          aria-label="back" icon={<ArrowBackIcon />} onClick={onBack}
          variant="ghost" color="white" borderRadius="full"
        />
        <Text fontWeight="900" fontSize="20px">{title}</Text>
      </HStack>
      <InputGroup px={2}>
        <InputLeftElement ml={2} pointerEvents="none">
          <SearchIcon color="whiteAlpha.300" />
        </InputLeftElement>
        <Input
          placeholder="Поиск..." bg="whiteAlpha.50" border="none"
          h="52px" borderRadius="18px" value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>
      <Box flex={1} overflowY="auto" pb={10} px={2} mt={2}>
        {isLoading ? (
          <Center py={10}><Spinner color="brand.500" size="lg" thickness="3px" /></Center>
        ) : (
          <SimpleGrid columns={3} spacing={3}>
            {filtered.map((item, idx) => {
              const name = typeof item === "string" ? item : (item.name || "")
              const isSelected = selectedItems.includes(name)

              return (
                <Box
                  key={idx}
                  bg={isSelected ? "rgba(232, 215, 253, 0.15)" : "whiteAlpha.50"}
                  p={2}
                  borderRadius="24px"
                  onClick={() => onSelect(item)}
                  cursor="pointer"
                  transition="all 0.2s"
                  position="relative"
                  border="2px solid"
                  borderColor={isSelected ? "brand.500" : "transparent"}
                  _active={{ transform: "scale(0.92)" }}
                >
                  {isSelected && (
                    <Center position="absolute" top="-5px" right="-5px" bg="brand.500" borderRadius="full" boxSize="20px" zIndex={2}>
                      <CheckIcon color="black" boxSize="10px" />
                    </Center>
                  )}
                  <Center h="70px" mb={1}>
                    {renderCustomItem ? renderCustomItem(item) : (
                      getImageUrl ? (
                        <Image src={getImageUrl(item)} boxSize="55px" objectFit="contain" fallback={<Spinner size="xs" />} />
                      ) : <Box boxSize="40px" borderRadius="full" bg="whiteAlpha.100" />
                    )}
                  </Center>
                  <Text fontSize="10px" fontWeight="800" textAlign="center" color={isSelected ? "white" : "whiteAlpha.800"} isTruncated px={1}>
                    {name}
                  </Text>
                </Box>
              )
            })}
          </SimpleGrid>
        )}
      </Box>
    </VStack>
  )
}