import React, { useState, useEffect, useMemo, useCallback } from "react"
import {
  VStack,
  SimpleGrid,
  Button,
  Box,
  Text,
  Flex,
  Icon,
  Spinner,
  Center,
  Image,
  AspectRatio,
  Badge,
  Select,
} from "@chakra-ui/react"
import { RepeatIcon } from "@chakra-ui/icons"
import { SearchField } from "./SearchField"
import { GiftPreview } from "./GiftPreview"
import { AttributePicker } from "./AttributePicker"
import { Pagination } from "../../Home/Pagination"
import ChangesService, { ApiBackdrop } from "@services/changes"
import InventoryService from "@services/inventory"
import { GiftShortResponse, GiftSearchRequest } from "@types/inventory"

type ViewState = "FORM" | "PICK_GIFT" | "PICK_MODEL" | "PICK_PATTERN" | "PICK_BACKDROP"

const INITIAL_FORM = {
  gift: "Все подарки",
  model: "Любая модель",
  pattern: "Любой узор",
  backdropObj: null as ApiBackdrop | null,
  number: "",
  sortBy: "newest",
}

const PAGE_SIZE = 20

interface NftSearchSectionProps {
  onGiftClick: (slug: string, num: number) => void
}

export const NftSearchSection: React.FC<NftSearchSectionProps> = ({ onGiftClick }) => {
  const [view, setView] = useState<ViewState>("FORM")
  const [allGifts, setAllGifts] = useState<string[]>([])
  const [attributes, setAttributes] = useState({
    models: [],
    patterns: [],
    backdrops: [],
    loading: false,
  })

  const [form, setForm] = useState(INITIAL_FORM)
  const [searchResults, setSearchResults] = useState<GiftShortResponse[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Инициализация списка всех подарков
  useEffect(() => {
    ChangesService.getGifts().then(setAllGifts)
  }, [])

  // Логика состояния формы
  const isGiftSelected = form.gift !== "Все подарки"
  const canSearch = isGiftSelected || form.number.trim().length > 0

  // Загрузка атрибутов при выборе конкретного подарка
  useEffect(() => {
    if (isGiftSelected) {
      setAttributes((prev) => ({ ...prev, loading: true }))
      Promise.all([
        ChangesService.getModels(form.gift),
        ChangesService.getPatterns(form.gift),
        ChangesService.getBackdrops(form.gift),
      ]).then(([models, patterns, backdrops]) => {
        setAttributes({ models, patterns, backdrops, loading: false })
      })
    }
  }, [form.gift, isGiftSelected])

  const handleReset = () => {
    setForm(INITIAL_FORM)
    setSearchResults([])
    setTotalResults(0)
    setHasSearched(false)
    setCurrentPage(1)
  }

  const handleSearch = async (page: number = 1) => {
    setIsSearching(true)
    setHasSearched(true)
    setCurrentPage(page)

    const searchRequest: GiftSearchRequest = {
      sortBy: form.sortBy,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }

    const input = form.number.trim()
    if (input) {
      if (/^\d+$/.test(input)) {
        searchRequest.giftId = parseInt(input, 10)
      } else {
        searchRequest.query = input
      }
    }

    if (isGiftSelected) {
      searchRequest.query = searchRequest.query ? `${form.gift} ${searchRequest.query}` : form.gift
    }
    if (form.model !== "Любая модель") {
      searchRequest.models = [form.model]
    }
    if (form.backdropObj) {
      searchRequest.backdrops = [form.backdropObj.name]
    }
    if (form.pattern !== "Любой узор") {
      searchRequest.symbols = [form.pattern]
    }

    try {
      const response = await InventoryService.searchGifts(searchRequest)
      setSearchResults(response.items || [])
      setTotalResults(response.total || 0)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const previewData = useMemo(() => {
    if (!isGiftSelected) return null
    return {
      modelUrl:
        form.model === "Любая модель"
          ? ChangesService.getOriginalUrl(form.gift, "json")
          : ChangesService.getModelUrl(form.gift, form.model, "json"),
      patternUrl:
        form.pattern !== "Любой узор" ? ChangesService.getPatternImage(form.gift, form.pattern) : null,
      bg: form.backdropObj
        ? {
            center: form.backdropObj.hex.centerColor,
            edge: form.backdropObj.hex.edgeColor,
            pattern: form.backdropObj.hex.patternColor,
          }
        : null,
    }
  }, [form, isGiftSelected])

  // Рендер выбора атрибутов (Модель, Узор и т.д.)
  if (view !== "FORM") {
    const items =
      view === "PICK_GIFT"
        ? allGifts
        : view === "PICK_MODEL"
        ? attributes.models
        : view === "PICK_PATTERN"
        ? attributes.patterns
        : attributes.backdrops

    return (
      <AttributePicker
        title={
          view === "PICK_GIFT"
            ? "Подарок"
            : view === "PICK_MODEL"
            ? "Модель"
            : view === "PICK_PATTERN"
            ? "Узор"
            : "Фон"
        }
        items={items}
        isLoading={view !== "PICK_GIFT" && attributes.loading}
        onBack={() => setView("FORM")}
        onSelect={(item) => {
          setForm((prev) => ({
            ...prev,
            gift: view === "PICK_GIFT" ? item : prev.gift,
            model: view === "PICK_GIFT" ? "Любая модель" : view === "PICK_MODEL" ? item : prev.model,
            pattern: view === "PICK_PATTERN" ? item : prev.pattern,
            backdropObj: view === "PICK_BACKDROP" ? item : prev.backdropObj,
          }))
          setView("FORM")
        }}
        getImageUrl={(n) => {
          if (view === "PICK_GIFT") return ChangesService.getOriginalUrl(n, "png")
          if (view === "PICK_MODEL") return ChangesService.getModelUrl(form.gift, n, "png")
          return ChangesService.getPatternImage(form.gift, n)
        }}
        renderCustomItem={
          view === "PICK_BACKDROP"
            ? (item: ApiBackdrop) => (
                <Box
                  boxSize="40px"
                  borderRadius="full"
                  style={{
                    background: `radial-gradient(circle, ${item.hex.centerColor} 0%, ${item.hex.edgeColor} 100%)`,
                  }}
                />
              )
            : undefined
        }
      />
    )
  }

  // Главный рендер формы
  return (
    <VStack spacing={5} align="stretch">
      <VStack spacing={3} align="stretch">
        <Flex justify="space-between" align="center" px={1}>
          <Text fontSize="10px" fontWeight="900" color="whiteAlpha.300" letterSpacing="1px">
            NFT PREVIEW
          </Text>
          <Flex as="button" align="center" onClick={handleReset} _active={{ opacity: 0.5 }}>
            <Icon as={RepeatIcon} boxSize="10px" color="brand.500" mr={1.5} />
            <Text color="brand.500" fontSize="10px" fontWeight="900">
              СБРОСИТЬ
            </Text>
          </Flex>
        </Flex>

        <GiftPreview
          giftName={form.gift}
          modelUrl={previewData?.modelUrl}
          patternUrl={previewData?.patternUrl}
          bg={previewData?.bg}
          isSelected={isGiftSelected}
        />

        <VStack spacing={2} align="stretch">
          <SimpleGrid columns={2} spacing={3}>
            <Box onClick={() => setView("PICK_GIFT")}>
              <SearchField label="Подарок" isMenu readOnly>
                <Text px="12px" h="44px" lineHeight="44px" fontSize="13px" fontWeight="700" isTruncated>
                  {form.gift}
                </Text>
              </SearchField>
            </Box>
            <Box onClick={() => isGiftSelected && setView("PICK_MODEL")} opacity={isGiftSelected ? 1 : 0.3}>
              <SearchField label="Модель" isMenu readOnly>
                <Text px="12px" h="44px" lineHeight="44px" fontSize="13px" fontWeight="700" isTruncated>
                  {form.model}
                </Text>
              </SearchField>
            </Box>
          </SimpleGrid>

          <SimpleGrid columns={2} spacing={3}>
            <Box onClick={() => isGiftSelected && setView("PICK_PATTERN")} opacity={isGiftSelected ? 1 : 0.3}>
              <SearchField label="Узор" isMenu readOnly>
                <Text px="12px" h="44px" lineHeight="44px" fontSize="13px" fontWeight="700" isTruncated>
                  {form.pattern}
                </Text>
              </SearchField>
            </Box>
            <Box onClick={() => isGiftSelected && setView("PICK_BACKDROP")} opacity={isGiftSelected ? 1 : 0.3}>
              <SearchField label="Фон" isMenu readOnly>
                <Text px="12px" h="44px" lineHeight="44px" fontSize="13px" fontWeight="700" isTruncated>
                  {form.backdropObj?.name || "Любой"}
                </Text>
              </SearchField>
            </Box>
          </SimpleGrid>

          <SimpleGrid columns={2} spacing={3} alignItems="flex-end">
            <SearchField
              label="Поиск по ID / Названию"
              placeholder="Напр. 123"
              value={form.number}
              onChange={(e) => setForm((p) => ({ ...p, number: e.target.value }))}
            />
            <VStack align="stretch" spacing={1}>
                 <Text fontSize="11px" fontWeight="800" color="whiteAlpha.500" ml="4px" textTransform="uppercase">Сортировка</Text>
                 <Select
                    h="44px"
                    bg="whiteAlpha.50"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    borderRadius="16px"
                    fontSize="13px"
                    fontWeight="700"
                    color="white"
                    value={form.sortBy}
                    onChange={(e) => setForm(f => ({...f, sortBy: e.target.value}))}
                >
                    <option value="newest" style={{background: '#0F1115'}}>Новинки</option>
                    <option value="price_asc" style={{background: '#0F1115'}}>Дешевле</option>
                    <option value="price_desc" style={{background: '#0F1115'}}>Дороже</option>
                </Select>
            </VStack>
          </SimpleGrid>

          <Button
              mt={2}
              h="52px"
              bg="brand.500"
              color="black"
              borderRadius="18px"
              fontWeight="900"
              fontSize="15px"
              isLoading={isSearching}
              isDisabled={!canSearch}
              onClick={() => handleSearch(1)}
              _active={{ transform: "scale(0.96)" }}
            >
              ПОИСК
            </Button>
        </VStack>
      </VStack>

      <Box mt={4} id="results-header">
        {isSearching && searchResults.length === 0 ? (
          <Center py={10}>
            <Spinner color="brand.500" size="lg" thickness="3px" />
          </Center>
        ) : hasSearched ? (
          <VStack align="stretch" spacing={4}>
            <Text fontSize="10px" fontWeight="900" color="whiteAlpha.300" letterSpacing="1px" px={1}>
              РЕЗУЛЬТАТЫ ({totalResults})
            </Text>
            {searchResults.length > 0 ? (
              <>
                <SimpleGrid columns={2} spacing={4}>
                  {searchResults.map((item) => (
                    <Box key={item.id} onClick={() => {
                      const parts = item.id.split('-');
                      const num = parseInt(parts.pop() || "0");
                      const slug = parts.join('-');
                      onGiftClick(slug, num);
                    }}>
                      <NftSearchResultCard item={item} />
                    </Box>
                  ))}
                </SimpleGrid>
                <Pagination
                    currentPage={currentPage}
                    totalCount={totalResults}
                    pageSize={PAGE_SIZE}
                    onPageChange={handleSearch}
                />
              </>
            ) : (
              <Center py={10} bg="whiteAlpha.50" borderRadius="20px">
                <Text color="whiteAlpha.400" fontSize="13px" fontWeight="700">
                  Ничего не найдено
                </Text>
              </Center>
            )}
          </VStack>
        ) : null}
      </Box>
    </VStack>
  )
}

const NftSearchResultCard: React.FC<{ item: GiftShortResponse }> = ({ item }) => {
  const isForSale = item.price && item.price > 0
  return (
    <Box
      position="relative"
      bg="whiteAlpha.50"
      borderRadius="24px"
      overflow="hidden"
      border="1px solid"
      borderColor="whiteAlpha.100"
      transition="all 0.2s"
      cursor="pointer"
      _active={{ transform: "scale(0.96)" }}
    >
      <AspectRatio ratio={1}>
        <Box position="relative">
          <Image src={item.image} w="100%" h="100%" objectFit="cover" />
          <Box position="absolute" top="10px" left="10px">
            <Badge
              bg={item.is_offchain ? "orange.400" : "blue.500"}
              color="white"
              fontSize="8px"
              fontWeight="900"
              borderRadius="6px"
              px={2}
              py={0.5}
              textTransform="uppercase"
            >
              {item.is_offchain ? "Off-chain" : "On-chain"}
            </Badge>
          </Box>
          <Box position="absolute" top="10px" right="10px">
            <Badge
              bg={isForSale ? "green.400" : "whiteAlpha.300"}
              color={isForSale ? "black" : "whiteAlpha.700"}
              fontSize="8px"
              fontWeight="900"
              borderRadius="6px"
              px={2}
              py={0.5}
            >
              {isForSale ? `${item.price} TON` : "PRIVATE"}
            </Badge>
          </Box>
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            bgGradient="linear(to-t, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)"
            p={3}
            pt={8}
          >
            <VStack align="start" spacing={0.5}>
              <Text fontSize="12px" fontWeight="900" color="white" isTruncated w="100%">
                {item.name || item.slug}
              </Text>
              <Text fontSize="9px" color="brand.500" fontWeight="800" letterSpacing="0.2px" textTransform="uppercase">
                {item.symbol || item.model}
              </Text>
            </VStack>
          </Box>
        </Box>
      </AspectRatio>
    </Box>
  )
}