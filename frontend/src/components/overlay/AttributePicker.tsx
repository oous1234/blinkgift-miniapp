import React, { useState } from "react"
import {
  Box, SimpleGrid, Image, Text, Input, VStack, Center, Spinner,
  InputGroup, InputLeftElement, IconButton, HStack,
} from "@chakra-ui/react"
import { SearchIcon, ArrowBackIcon } from "@chakra-ui/icons"

interface AttributePickerProps {
  title: string
  items: any[] // Может быть строкой или объектом (как Backdrop)
  onSelect: (item: any) => void
  onBack: () => void
  getImageUrl?: (item: any) => string
  renderCustomItem?: (item: any) => React.ReactNode // Для отрисовки градиентов
  isLoading?: boolean
}

export const AttributePicker: React.FC<AttributePickerProps> = ({
  title,
  items,
  onSelect,
  onBack,
  getImageUrl,
  renderCustomItem,
  isLoading,
}) => {
  const [search, setSearch] = useState("")

  const filtered = items.filter((i) => {
    const name = typeof i === "string" ? i : i.name
    return name.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <VStack spacing={4} align="stretch" h="100%">
      <HStack spacing={4} px={2}>
        <IconButton aria-label="back" icon={<ArrowBackIcon />} onClick={onBack} variant="ghost" color="white" />
        <Text fontWeight="900" fontSize="18px" color="white">{title}</Text>
      </HStack>

      <InputGroup px={2}>
        <InputLeftElement ml={2} children={<SearchIcon color="gray.500" />} />
        <Input
          placeholder="Поиск..." bg="whiteAlpha.50" border="none"
          borderRadius="14px" color="white" value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      <Box flex={1} overflowY="auto" pb={10} px={2}>
        {isLoading ? (
          <Center py={10}><Spinner color="brand.500" size="lg" /></Center>
        ) : (
          <SimpleGrid columns={3} spacing={3}>
            {filtered.map((item, idx) => {
              const name = typeof item === "string" ? item : item.name
              return (
                <Box
                  key={idx} bg="whiteAlpha.50" p={2} borderRadius="20px"
                  onClick={() => onSelect(item)} cursor="pointer" transition="0.2s"
                  _active={{ transform: "scale(0.95)", bg: "whiteAlpha.200" }}
                >
                  <Center h="70px" mb={1}>
                    {renderCustomItem ? renderCustomItem(item) : (
                      getImageUrl ? (
                        <Image src={getImageUrl(item)} boxSize="60px" objectFit="contain" fallback={<Spinner size="xs" />} />
                      ) : <Box boxSize="40px" borderRadius="full" bg="whiteAlpha.100" />
                    )}
                  </Center>
                  <Text fontSize="10px" fontWeight="800" textAlign="center" color="whiteAlpha.800" isTruncated>
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