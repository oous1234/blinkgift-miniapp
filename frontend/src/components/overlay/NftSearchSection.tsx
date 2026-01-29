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
  Center, // Добавлено сюда
} from "@chakra-ui/react"
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import { SearchField } from "./SearchField"
import { AttributePicker } from "./AttributePicker"
import ChangesService from "../../services/changes"

export const NftSearchSection = () => {
  const [view, setView] = useState<"FORM" | "PICK_MODEL">("FORM")
  const [showGifts, setShowGifts] = useState(false)
  const [allGifts, setAllGifts] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [isLoadingGifts, setIsLoadingGifts] = useState(false)
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [form, setForm] = useState({
    gift: "Все подарки",
    model: "Любая модель",
    number: ""
  })

  // 1. Загружаем список подарков при открытии выпадашки
  useEffect(() => {
    if (showGifts && allGifts.length === 0) {
      setIsLoadingGifts(true)
      ChangesService.getGifts().then((data) => {
        setAllGifts(data)
        setIsLoadingGifts(false)
      })
    }
  }, [showGifts])

  // 2. Когда выбрали конкретный подарок, сразу подтягиваем его модели
  useEffect(() => {
    if (form.gift !== "Все подарки") {
      setIsLoadingModels(true)
      ChangesService.getModels(form.gift).then((data) => {
        setModels(data)
        setIsLoadingModels(false)
      })
    } else {
      setModels([])
    }
  }, [form.gift])

  const filteredGifts = useMemo(() => {
    return allGifts.filter(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [allGifts, searchTerm])

  // Если нажали "Модель", переключаем вид на AttributePicker
  if (view === "PICK_MODEL") {
    return (
      <AttributePicker
        title="Выберите модель"
        items={models}
        isLoading={isLoadingModels}
        onBack={() => setView("FORM")}
        onSelect={(val) => {
          setForm({ ...form, model: val })
          setView("FORM")
        }}
        // ПЕРЕДАЕМ ГЕНЕРАТОР ССЫЛОК С ДЕФИСАМИ
        getImageUrl={(modelName) => ChangesService.getModelImage(form.gift, modelName)}
      />
    )
  }

  return (
    <VStack spacing={4} align="stretch">
      <Box position="relative">
        <SimpleGrid columns={2} spacing={3}>
          {/* ПОЛЕ: ВЫБОР ПОДАРКА */}
          <Box onClick={() => setShowGifts(!showGifts)} cursor="pointer">
            <SearchField label="Подарок" isMenu readOnly>
              <HStack justify="space-between" px="12px" h="48px">
                <Text fontSize="14px" fontWeight="700" color="white" isTruncated>
                  {form.gift}
                </Text>
                {showGifts ? <ChevronUpIcon color="brand.500" /> : <ChevronDownIcon color="gray.500" />}
              </HStack>
            </SearchField>
          </Box>

          {/* ПОЛЕ: ВЫБОР МОДЕЛИ */}
          <Box
            onClick={() => form.gift !== "Все подарки" && setView("PICK_MODEL")}
            cursor={form.gift === "Все подарки" ? "not-allowed" : "pointer"}
            opacity={form.gift === "Все подарки" ? 0.4 : 1}
          >
            <SearchField label="Модель" isMenu readOnly>
              <HStack justify="space-between" px="12px" h="48px">
                <Text fontSize="14px" fontWeight="700" color="white" isTruncated>
                  {form.model}
                </Text>
                <ChevronDownIcon color="gray.500" />
              </HStack>
            </SearchField>
          </Box>
        </SimpleGrid>

        {/* ВЫПАДАЮЩИЙ СПИСОК ПОДАРКОВ */}
        <Collapse in={showGifts} animateOpacity>
          <Box
            mt={2}
            bg="#1F232E"
            borderRadius="20px"
            border="1px solid"
            borderColor="whiteAlpha.200"
            overflow="hidden"
            maxH="300px"
            display="flex"
            flexDirection="column"
            boxShadow="xl"
          >
            <Box p={2} borderBottom="1px solid" borderColor="whiteAlpha.100">
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.500" />
                </InputLeftElement>
                <Input
                  placeholder="Поиск..."
                  variant="unstyled"
                  bg="whiteAlpha.50"
                  borderRadius="10px"
                  px={10}
                  h="36px"
                  color="white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Box>
            <Box overflowY="auto" p={1} maxH="240px">
              {isLoadingGifts ? (
                <Center py={4}><Spinner size="sm" color="brand.500" /></Center>
              ) : (
                <VStack spacing={1} align="stretch">
                  {filteredGifts.map((gift) => (
                    <HStack
                      key={gift}
                      p={3}
                      borderRadius="14px"
                      cursor="pointer"
                      transition="0.2s"
                      _hover={{ bg: "whiteAlpha.100" }}
                      onClick={() => {
                        setForm({ ...form, gift: gift, model: "Любая модель" })
                        setShowGifts(false)
                      }}
                    >
                      <Image
                        src={ChangesService.getOriginalImage(gift)}
                        boxSize="32px"
                        borderRadius="8px"
                        fallback={<Box boxSize="32px" bg="whiteAlpha.100" borderRadius="8px" />}
                      />
                      <Text fontSize="14px" fontWeight="600" color="white">{gift}</Text>
                    </HStack>
                  ))}
                </VStack>
              )}
            </Box>
          </Box>
        </Collapse>
      </Box>

      <SearchField
        label="Номер #"
        placeholder="Например, 123"
        type="number"
        value={form.number}
        onChange={(e) => setForm({ ...form, number: e.target.value })}
      />

      <Button
        h="56px"
        bg="white"
        color="black"
        borderRadius="20px"
        fontWeight="900"
        fontSize="16px"
        mt={2}
        _active={{ transform: "scale(0.96)" }}
      >
        Найти NFT
      </Button>
    </VStack>
  )
}