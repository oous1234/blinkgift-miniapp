// frontend/src/components/overlay/SearchAttributeGrid.tsx

import React, { useState } from "react"
import {
    Box, SimpleGrid, Image, Text, Input, VStack,
    Center, Spinner, InputGroup, InputLeftElement
} from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons"

interface AttributeGridProps {
    items: string[]
    onSelect: (item: string) => void
    getImageUrl?: (item: string) => string
    isLoading?: boolean
    placeholder: string
}

export const SearchAttributeGrid: React.FC<AttributeGridProps> = ({
                                                                      items,
                                                                      onSelect,
                                                                      getImageUrl,
                                                                      isLoading,
                                                                      placeholder
                                                                  }) => {
    const [search, setSearch] = useState("")

    const filtered = items.filter(item =>
        item.toLowerCase().includes(search.toLowerCase())
    )

    if (isLoading) {
        return (
            <Center py={10}>
                <Spinner color="brand.500" />
            </Center>
        )
    }

    return (
        <VStack spacing={4} align="stretch">
            <InputGroup>
                <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.500" />
                </InputLeftElement>
                <Input
                    placeholder={placeholder}
                    bg="whiteAlpha.50"
                    border="none"
                    borderRadius="12px"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </InputGroup>

            <SimpleGrid columns={3} spacing={3}>
                {filtered.map((item) => (
                    <Box
                        key={item}
                        bg="whiteAlpha.50"
                        borderRadius="16px"
                        p={2}
                        cursor="pointer"
                        transition="0.2s"
                        _active={{ transform: "scale(0.95)", bg: "whiteAlpha.100" }}
                        onClick={() => onSelect(item)}
                        textAlign="center"
                    >
                        {getImageUrl && (
                            <Center mb={2}>
                                <Image
                                    src={getImageUrl(item)}
                                    fallback={<Box boxSize="40px" bg="whiteAlpha.100" borderRadius="full" />}
                                    boxSize="50px"
                                    objectFit="contain"
                                />
                            </Center>
                        )}
                        <Text fontSize="10px" fontWeight="800" isTruncated color="white">
                            {item}
                        </Text>
                    </Box>
                ))}
            </SimpleGrid>
        </VStack>
    )
}