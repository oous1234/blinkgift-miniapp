import React, { useState, useEffect, useMemo } from "react"
import {
  VStack,
  SimpleGrid,
  Button,
  Box,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  Image,
  Spinner,
  Collapse,
} from "@chakra-ui/react"
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import { motion, AnimatePresence } from "framer-motion"
import { SearchField } from "./SearchField"
import ChangesService from "../../services/changes"

export const NftSearchSection = () => {
  const [showGifts, setShowGifts] = useState(false)
  const [allGifts, setAllGifts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [form, setForm] = useState({
    gift: "Все подарки",
    model: "",
    backdrop: "Все фоны",
    pattern: "Все узоры",
    number: ""
  })

  // Загружаем список только при открытии списка
  useEffect(() => {
    if (showGifts && allGifts.length === 0) {
      setIsLoading(true)
      ChangesService.getGifts().then((data) => {
        setAllGifts(data)
        setIsLoading(false)
      })
    }
  }, [showGifts])

  const filteredGifts = useMemo(() => {
    return allGifts.filter(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [allGifts, searchTerm])

  const handleSelectGift = (name: string) => {
    setForm({ ...form, gift: name })
    setShowGifts(false) // Закрываем список после выбора
  }

  return (
    <VStack spacing={4} align="stretch">
      <Box position="relative">
        <SimpleGrid columns={2} spacing={3}>
          {/* Кнопка выбора подарка */}
          <Box onClick={() => setShowGifts(!showGifts)} cursor="pointer">
            <SearchField label="Подарок" isMenu readOnly>
              <HStack justify="space-between" px="12px" h="48px">
                <Text fontSize="14px" fontWeight="700" isTruncated>
                  {form.gift}
                </Text>
                {showGifts ? <ChevronUpIcon color="brand.500" /> : <ChevronDownIcon />}
              </HStack>
            </SearchField>
          </Box>

          <SearchField
            label="Модель"
            placeholder="Pepe..."
            value={form.model}
            onChange={(e) => setForm({...form, model: e.target.value})}
          />
        </SimpleGrid>

        {/* Выпадающий список прямо внутри контента с анимацией */}
        <Collapse in={showGifts} animateOpacity>
          <Box
            mt={2}
            bg="whiteAlpha.100"
            borderRadius="18px"
            border="1px solid"
            borderColor="whiteAlpha.200"
            overflow="hidden"
            maxH="300px"
            display="flex"
            flexDirection="column"
          >
            <Box p={2} borderBottom="1px solid" borderColor="whiteAlpha.100">
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.500" />
                </InputLeftElement>
                <Input
                  placeholder="Поиск подарка..."
                  variant="unstyled"
                  bg="whiteAlpha.50"
                  borderRadius="10px"
                  px={10}
                  h="36px"
                  fontSize="13px"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Box>

            <Box overflowY="auto" p={1} maxH="240px">
              {isLoading ? (
                <HStack justify="center" py={4}><Spinner size="sm" color="brand.500" /></HStack>
              ) : (
                <VStack spacing={1} align="stretch">
                  <Box
                    p={2}
                    borderRadius="10px"
                    cursor="pointer"
                    _hover={{ bg: "whiteAlpha.200" }}
                    onClick={() => handleSelectGift("Все подарки")}
                  >
                    <Text fontSize="13px" fontWeight="700" color="gray.400">Все подарки</Text>
                  </Box>
                  {filteredGifts.map((gift) => (
                    <HStack
                      key={gift}
                      p={2}
                      borderRadius="12px"
                      cursor="pointer"
                      transition="0.2s"
                      _active={{ bg: "whiteAlpha.300", transform: "scale(0.98)" }}
                      _hover={{ bg: "whiteAlpha.200" }}
                      onClick={() => handleSelectGift(gift)}
                    >
                      <Image
                        src={ChangesService.getOriginalImage(gift)}
                        boxSize="28px"
                        borderRadius="6px"
                        fallback={<Box boxSize="28px" bg="whiteAlpha.100" />}
                      />
                      <Text fontSize="13px" fontWeight="600">{gift}</Text>
                    </HStack>
                  ))}
                </VStack>
              )}
            </Box>
          </Box>
        </Collapse>
      </Box>

      {/* Кнопка поиска всегда видна внизу */}
      <Button
        h="54px"
        bg="white"
        color="black"
        borderRadius="18px"
        fontWeight="900"
        mt={2}
        _active={{ transform: "scale(0.97)" }}
      >
        Найти NFT
      </Button>
    </VStack>
  )
}