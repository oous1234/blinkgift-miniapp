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

  const filtered = items.filter((i) => 
    i.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <VStack spacing={4} align="stretch" h="100%">
      <HStack spacing={4} px={2}>
        <IconButton
          aria-label="back"
          icon={<ArrowBackIcon />}
          onClick={onBack}
          variant="ghost"
          size="sm"
          color="white"
        />
        <Text fontWeight="900" fontSize="18px" color="white">
          {title}
        </Text>
      </HStack>

      <InputGroup px={2}>
        <InputLeftElement ml={2} children={<SearchIcon color="gray.500" />} />
        <Input
          placeholder="Поиск..."
          bg="whiteAlpha.50"
          border="none"
          borderRadius="14px"
          color="white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      <Box flex={1} overflowY="auto" pb={10} px={2}>
        {isLoading ? (
          <Center py={10}>
            <Spinner color="brand.500" size="lg" />
          </Center>
        ) : (
          <SimpleGrid columns={3} spacing={3}>
            {filtered.map((item) => (
              <Box
                key={item}
                bg="whiteAlpha.50"
                p={2}
                borderRadius="20px"
                onClick={() => onSelect(item)}
                cursor="pointer"
                transition="all 0.2s"
                border="1px solid transparent"
                _active={{ transform: "scale(0.95)", bg: "whiteAlpha.200", borderColor: "brand.500" }}
              >
                <Center h="70px" mb={1}>
                  {getImageUrl ? (
                    <Image
                      src={getImageUrl(item)}
                      boxSize="60px"
                      objectFit="contain"
                      loading="lazy"
                      fallback={<Spinner size="xs" color="whiteAlpha.300" />}
                      onLoad={() => console.log("Loaded:", getImageUrl(item))}
                      onError={() => console.error("Failed to load:", getImageUrl(item))}
                    />
                  ) : (
                    <Box boxSize="40px" borderRadius="full" bg="whiteAlpha.100" />
                  )}
                </Center>
                <Text fontSize="10px" fontWeight="800" textAlign="center" color="whiteAlpha.800" isTruncated>
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