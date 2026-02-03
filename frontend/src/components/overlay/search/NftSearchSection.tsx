import React, { useState, useEffect, useMemo } from "react"
import {
  VStack, SimpleGrid, Button, Box, Text, Flex, Icon, Spinner, Center, Image, AspectRatio, Badge, Select,
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
const PAGE_SIZE = 20

interface NftSearchSectionProps {
  onGiftClick: (slug: string, num: number) => void
  persistentForm: any
  setPersistentForm: (f: any) => void
  persistentResults: GiftShortResponse[]
  setPersistentResults: (r: GiftShortResponse[]) => void
  persistentTotal: number
  setPersistentTotal: (t: number) => void
  persistentPage: number
  setPersistentPage: (p: number) => void
  persistentHasSearched: boolean
  setPersistentHasSearched: (h: boolean) => void
}

export const NftSearchSection: React.FC<NftSearchSectionProps> = ({
  onGiftClick,
  persistentForm, setPersistentForm,
  persistentResults, setPersistentResults,
  persistentTotal, setPersistentTotal,
  persistentPage, setPersistentPage,
  persistentHasSearched, setPersistentHasSearched
}) => {
  const [view, setView] = useState<ViewState>("FORM")
  const [allGifts, setAllGifts] = useState<string[]>([])
  const [attributes, setAttributes] = useState({ models: [], patterns: [], backdrops: [], loading: false })
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    ChangesService.getGifts().then(setAllGifts)
  }, [])

  const isGiftSelected = persistentForm.gift !== "Все подарки"
  const canSearch = isGiftSelected || persistentForm.number.trim().length > 0

  useEffect(() => {
    if (isGiftSelected) {
      setAttributes((prev) => ({ ...prev, loading: true }))
      Promise.all([
        ChangesService.getModels(persistentForm.gift),
        ChangesService.getPatterns(persistentForm.gift),
        ChangesService.getBackdrops(persistentForm.gift),
      ]).then(([models, patterns, backdrops]) => {
        setAttributes({ models, patterns, backdrops, loading: false })
      })
    }
  }, [persistentForm.gift, isGiftSelected])

  const handleReset = () => {
    setPersistentForm(INITIAL_NFT_FORM)
    setPersistentResults([])
    setPersistentTotal(0)
    setPersistentHasSearched(false)
    setPersistentPage(1)
  }

  const handleSearch = async (page: number = 1) => {
    setIsSearching(true)
    setPersistentHasSearched(true)
    setPersistentPage(page)
    const searchRequest: GiftSearchRequest = {
      sortBy: persistentForm.sortBy,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }
    const input = persistentForm.number.trim()
    if (input) {
      if (/^\d+$/.test(input)) searchRequest.giftId = parseInt(input, 10)
      else searchRequest.query = input
    }
    if (isGiftSelected) {
      searchRequest.query = searchRequest.query ? `${persistentForm.gift} ${searchRequest.query}` : persistentForm.gift
    }
    if (persistentForm.model !== "Любая модель") searchRequest.models = [persistentForm.model]
    if (persistentForm.backdropObj) searchRequest.backdrops = [persistentForm.backdropObj.name]
    if (persistentForm.pattern !== "Любой узор") searchRequest.symbols = [persistentForm.pattern]

    try {
      const response = await InventoryService.searchGifts(searchRequest)
      setPersistentResults(response.items || [])
      setPersistentTotal(response.total || 0)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSearching(false)
    }
  }

  const previewData = useMemo(() => {
    if (!isGiftSelected) return null
    return {
      modelUrl: persistentForm.model === "Любая модель"
        ? ChangesService.getOriginalUrl(persistentForm.gift, "json")
        : ChangesService.getModelUrl(persistentForm.gift, persistentForm.model, "json"),
      patternUrl: persistentForm.pattern !== "Любой узор" ? ChangesService.getPatternImage(persistentForm.gift, persistentForm.pattern) : null,
      bg: persistentForm.backdropObj ? {
        center: persistentForm.backdropObj.hex.centerColor,
        edge: persistentForm.backdropObj.hex.edgeColor,
        pattern: persistentForm.backdropObj.hex.patternColor,
      } : null,
    }
  }, [persistentForm, isGiftSelected])

  if (view !== "FORM") {
    const items = view === "PICK_GIFT" ? allGifts : view === "PICK_MODEL" ? attributes.models : view === "PICK_PATTERN" ? attributes.patterns : attributes.backdrops
    return (
      <AttributePicker
        title={view === "PICK_GIFT" ? "Подарок" : view === "PICK_MODEL" ? "Модель" : view === "PICK_PATTERN" ? "Узор" : "Фон"}
        items={items}
        isLoading={view !== "PICK_GIFT" && attributes.loading}
        onBack={() => setView("FORM")}
        onSelect={(item) => {
          setPersistentForm({
            ...persistentForm,
            gift: view === "PICK_GIFT" ? item : persistentForm.gift,
            model: view === "PICK_GIFT" ? "Любая модель" : view === "PICK_MODEL" ? item : persistentForm.model,
            pattern: view === "PICK_PATTERN" ? item : persistentForm.pattern,
            backdropObj: view === "PICK_BACKDROP" ? item : persistentForm.backdropObj,
          })
          setView("FORM")
        }}
        getImageUrl={(n) => {
          if (view === "PICK_GIFT") return ChangesService.getOriginalUrl(n, "png")
          if (view === "PICK_MODEL") return ChangesService.getModelUrl(persistentForm.gift, n, "png")
          return ChangesService.getPatternImage(persistentForm.gift, n)
        }}
        renderCustomItem={view === "PICK_BACKDROP" ? (item: ApiBackdrop) => (
          <Box boxSize="40px" borderRadius="full" style={{ background: `radial-gradient(circle, ${item.hex.centerColor} 0%, ${item.hex.edgeColor} 100%)` }} />
        ) : undefined}
      />
    )
  }

  return (
    <VStack spacing={6} align="stretch">
      <VStack spacing={4} align="stretch">
        <Flex justify="space-between" align="center">
          <Text fontSize="11px" fontWeight="900" color="whiteAlpha.400" letterSpacing="1px">NFT BUILDER</Text>
          <Button size="xs" variant="ghost" color="brand.500" leftIcon={<RepeatIcon />} onClick={handleReset} fontWeight="900">
            СБРОС
          </Button>
        </Flex>

        <GiftPreview
          giftName={persistentForm.gift}
          modelUrl={previewData?.modelUrl}
          patternUrl={previewData?.patternUrl}
          bg={previewData?.bg}
          isSelected={isGiftSelected}
        />

        <VStack spacing={3} align="stretch">
          <SimpleGrid columns={2} spacing={3}>
            <Box onClick={() => setView("PICK_GIFT")}>
              <SearchField label="Подарок" isMenu readOnly>
                <Text px="16px" fontSize="14px" fontWeight="700" isTruncated>{persistentForm.gift}</Text>
              </SearchField>
            </Box>
            <Box onClick={() => isGiftSelected && setView("PICK_MODEL")} opacity={isGiftSelected ? 1 : 0.4}>
              <SearchField label="Модель" isMenu readOnly>
                <Text px="16px" fontSize="14px" fontWeight="700" isTruncated>{persistentForm.model}</Text>
              </SearchField>
            </Box>
          </SimpleGrid>

          <SimpleGrid columns={2} spacing={3}>
            <Box onClick={() => isGiftSelected && setView("PICK_PATTERN")} opacity={isGiftSelected ? 1 : 0.4}>
              <SearchField label="Узор" isMenu readOnly>
                <Text px="16px" fontSize="14px" fontWeight="700" isTruncated>{persistentForm.pattern}</Text>
              </SearchField>
            </Box>
            <Box onClick={() => isGiftSelected && setView("PICK_BACKDROP")} opacity={isGiftSelected ? 1 : 0.4}>
              <SearchField label="Фон" isMenu readOnly>
                <Text px="16px" fontSize="14px" fontWeight="700" isTruncated>{persistentForm.backdropObj?.name || "Любой"}</Text>
              </SearchField>
            </Box>
          </SimpleGrid>

          <SimpleGrid columns={2} spacing={3} alignItems="flex-end">
            <SearchField
              label="ID / Поиск"
              placeholder="#123 или название"
              value={persistentForm.number}
              onChange={(e) => setPersistentForm({ ...persistentForm, number: e.target.value })}
            />
            <VStack align="stretch" spacing={2}>
              <Text fontSize="10px" fontWeight="900" color="whiteAlpha.400" ml="4px" textTransform="uppercase">Сортировка</Text>
              <Select
                h="48px" bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.100" borderRadius="20px"
                fontSize="14px" fontWeight="700" color="white" value={persistentForm.sortBy}
                onChange={(e) => setPersistentForm({ ...persistentForm, sortBy: e.target.value })}
              >
                <option value="newest" style={{ background: '#0F1115' }}>Новые</option>
                <option value="price_asc" style={{ background: '#0F1115' }}>Дешевле</option>
                <option value="price_desc" style={{ background: '#0F1115' }}>Дороже</option>
              </Select>
            </VStack>
          </SimpleGrid>

          <Button
            mt={2} h="56px" bg="brand.500" color="black" borderRadius="20px" fontWeight="900" fontSize="16px"
            isLoading={isSearching} isDisabled={!canSearch} onClick={() => handleSearch(1)}
            _active={{ transform: "scale(0.96)" }}
          >
            НАЙТИ NFT
          </Button>
        </VStack>
      </VStack>

      {persistentHasSearched && (
        <Box mt={4}>
          <Text fontSize="11px" fontWeight="900" color="whiteAlpha.400" mb={4} letterSpacing="1px">РЕЗУЛЬТАТЫ ({persistentTotal})</Text>
          {isSearching && persistentResults.length === 0 ? (
            <Center py={10}><Spinner color="brand.500" size="lg" /></Center>
          ) : persistentResults.length > 0 ? (
            <>
              <SimpleGrid columns={2} spacing={4}>
                {persistentResults.map((item) => (
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
                currentPage={persistentPage}
                totalCount={persistentTotal}
                pageSize={PAGE_SIZE}
                onPageChange={handleSearch}
              />
            </>
          ) : (
            <Center py={12} bg="whiteAlpha.50" borderRadius="24px">
              <Text color="whiteAlpha.300" fontWeight="700">Ничего не найдено</Text>
            </Center>
          )}
        </Box>
      )}
    </VStack>
  )
}

const NftSearchResultCard: React.FC<{ item: GiftShortResponse }> = ({ item }) => {
  const isForSale = item.price && item.price > 0
  return (
    <Box position="relative" bg="whiteAlpha.50" borderRadius="24px" overflow="hidden" border="1px solid" borderColor="whiteAlpha.100" transition="0.2s" _active={{ transform: "scale(0.95)" }}>
      <AspectRatio ratio={1}>
        <Box position="relative">
          <Image src={item.image} w="100%" h="100%" objectFit="cover" />
          <Box position="absolute" top="10px" left="10px">
            <Badge bg={item.is_offchain ? "orange.400" : "blue.500"} color="white" fontSize="9px" borderRadius="6px" px={2}>
              {item.is_offchain ? "Off-chain" : "On-chain"}
            </Badge>
          </Box>
          <Box position="absolute" bottom="0" left="0" right="0" bgGradient="linear(to-t, rgba(0,0,0,0.9) 0%, transparent 100%)" p={3}>
            <Text fontSize="13px" fontWeight="900" color="white" isTruncated>{item.name || item.slug}</Text>
            <Text fontSize="11px" color="brand.500" fontWeight="800">
               {isForSale ? `${item.price} TON` : "Private"}
            </Text>
          </Box>
        </Box>
      </AspectRatio>
    </Box>
  )
}

const INITIAL_NFT_FORM = {
    gift: "Все подарки",
    model: "Любая модель",
    pattern: "Любой узор",
    backdropObj: null as ApiBackdrop | null,
    number: "",
    sortBy: "newest",
}