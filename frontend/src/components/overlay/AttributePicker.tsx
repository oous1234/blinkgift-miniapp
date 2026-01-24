// frontend/src/components/overlay/AttributePicker.tsx
import React, { useState } from "react"
import {
  Box,
  SimpleGrid,
  Image,
  Text,
  Input,
  VStack,
  Center,
  Spinner,
  InputGroup,
  InputLeftElement,
  IconButton,
  HStack,
} from "@chakra-ui/react"
import { SearchIcon, ArrowBackIcon } from "@chakra-ui/icons"

interface AttributePickerProps {
  title: string
  items: string[]
  onSelect: (item: string) => void
  onBack: () => void
  getImageUrl?: (item: string) => string
  isLoading?: boolean
}

export const AttributePicker: React.FC<AttributePickerProps> = ({
  title,
  items,
  onSelect,
  onBack,
  getImageUrl,
  isLoading,
}) => {
  const [search, setSearch] = useState("")
  const filtered = items.filter((i) => i.toLowerCase().includes(search.toLowerCase()))

  return (
    <VStack spacing={4} align="stretch" h="100%">
      <HStack spacing={4}>
        <IconButton
          aria-label="back"
          icon={<ArrowBackIcon />}
          onClick={onBack}
          variant="ghost"
          size="sm"
        />
        <Text fontWeight="900" fontSize="18px">
          {title}
        </Text>
      </HStack>

      <InputGroup>
        <InputLeftElement children={<SearchIcon color="gray.500" />} />
        <Input
          placeholder="Поиск..."
          bg="whiteAlpha.50"
          border="none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      <Box flex={1} overflowY="auto" pb={10}>
        {isLoading ? (
          <Center py={10}>
            <Spinner color="brand.500" />
          </Center>
        ) : (
          <SimpleGrid columns={3} spacing={3}>
            {filtered.map((item) => (
              <Box
                key={item}
                bg="whiteAlpha.50"
                p={2}
                borderRadius="16px"
                onClick={() => onSelect(item)}
                cursor="pointer"
                _active={{ transform: "scale(0.95)" }}
              >
                <Center h="60px" mb={1}>
                  {getImageUrl ? (
                    <Image
                      src={getImageUrl(item)}
                      boxSize="50px"
                      objectFit="contain"
                      fallback={<Spinner size="xs" />}
                    />
                  ) : (
                    <Box boxSize="40px" borderRadius="full" bg="whiteAlpha.100" />
                  )}
                </Center>
                <Text fontSize="10px" fontWeight="800" textAlign="center" isTruncated>
                  {item}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </VStack>
  )
}
