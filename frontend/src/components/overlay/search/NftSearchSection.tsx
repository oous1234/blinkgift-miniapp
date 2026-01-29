import React, { useState, useEffect, useMemo, useCallback } from "react"
import { VStack, SimpleGrid, Button, Box, Text, Flex, Icon } from "@chakra-ui/react"
import { RepeatIcon } from "@chakra-ui/icons"
import { SearchField } from "./SearchField"
import { GiftPreview } from "./GiftPreview"
import { AttributePicker } from "./AttributePicker"
import ChangesService, { ApiBackdrop } from "@services/changes"

type ViewState = "FORM" | "PICK_GIFT" | "PICK_MODEL" | "PICK_PATTERN" | "PICK_BACKDROP"

const INITIAL_FORM = {
  gift: "Все подарки",
  model: "Любая модель",
  pattern: "Любой узор",
  backdropObj: null as ApiBackdrop | null,
  number: ""
}

export const NftSearchSection: React.FC = () => {
  const [view, setView] = useState<ViewState>("FORM")
  const [allGifts, setAllGifts] = useState<string[]>([])
  const [attributes, setAttributes] = useState({ models: [], patterns: [], backdrops: [], loading: false })
  const [form, setForm] = useState(INITIAL_FORM)

  useEffect(() => {
    ChangesService.getGifts().then(setAllGifts)
  }, [])

  const isGiftSelected = form.gift !== "Все подарки"

  useEffect(() => {
    if (isGiftSelected) {
      setAttributes(prev => ({ ...prev, loading: true }))
      Promise.all([
        ChangesService.getModels(form.gift),
        ChangesService.getPatterns(form.gift),
        ChangesService.getBackdrops(form.gift)
      ]).then(([models, patterns, backdrops]) => {
        setAttributes({ models, patterns, backdrops, loading: false })
      })
    }
  }, [form.gift, isGiftSelected])

  const handleReset = () => setForm(INITIAL_FORM)

  const previewData = useMemo(() => {
    if (!isGiftSelected) return null
    return {
      modelUrl: form.model === "Любая модель" ? ChangesService.getOriginalUrl(form.gift, 'json') : ChangesService.getModelUrl(form.gift, form.model, 'json'),
      patternUrl: form.pattern !== "Любой узор" ? ChangesService.getPatternImage(form.gift, form.pattern) : null,
      bg: form.backdropObj ? { center: form.backdropObj.hex.centerColor, edge: form.backdropObj.hex.edgeColor, pattern: form.backdropObj.hex.patternColor } : null
    }
  }, [form, isGiftSelected])

  const handleSelectAttribute = useCallback((type: ViewState, item: any) => {
    setForm(prev => ({
      ...prev,
      gift: type === "PICK_GIFT" ? item : prev.gift,
      model: type === "PICK_GIFT" ? "Любая модель" : (type === "PICK_MODEL" ? item : prev.model),
      pattern: type === "PICK_PATTERN" ? item : prev.pattern,
      backdropObj: type === "PICK_BACKDROP" ? item : prev.backdropObj,
    }))
    setView("FORM")
  }, [])

  if (view !== "FORM") {
    let items = view === "PICK_GIFT" ? allGifts : (view === "PICK_MODEL" ? attributes.models : (view === "PICK_PATTERN" ? attributes.patterns : attributes.backdrops))
    return (
      <AttributePicker
        title={view === "PICK_GIFT" ? "Подарок" : view === "PICK_MODEL" ? "Модель" : view === "PICK_PATTERN" ? "Узор" : "Фон"}
        items={items}
        isLoading={view !== "PICK_GIFT" && attributes.loading}
        onBack={() => setView("FORM")}
        onSelect={(item) => handleSelectAttribute(view, item)}
        getImageUrl={(n) => {
          if (view === "PICK_GIFT") return ChangesService.getOriginalUrl(n, 'png')
          if (view === "PICK_MODEL") return ChangesService.getModelUrl(form.gift, n, 'png')
          return ChangesService.getPatternImage(form.gift, n)
        }}
        renderCustomItem={view === "PICK_BACKDROP" ? (item: ApiBackdrop) => (
          <Box boxSize="40px" borderRadius="full" style={{ background: `radial-gradient(circle, ${item.hex.centerColor} 0%, ${item.hex.edgeColor} 100%)` }} />
        ) : undefined}
      />
    )
  }

  return (
    <VStack spacing={3} align="stretch">
      <Flex justify="space-between" align="center" px={1}>
        <Text fontSize="10px" fontWeight="900" color="whiteAlpha.300" letterSpacing="1px">NFT PREVIEW</Text>
        <Flex as="button" align="center" onClick={handleReset} _active={{ opacity: 0.5 }}>
           <Icon as={RepeatIcon} boxSize="10px" color="brand.500" mr={1.5} />
           <Text color="brand.500" fontSize="10px" fontWeight="900">СБРОСИТЬ</Text>
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
              <Text px="12px" h="44px" lineHeight="44px" fontSize="13px" fontWeight="700" isTruncated>{form.gift}</Text>
            </SearchField>
          </Box>
          <Box onClick={() => isGiftSelected && setView("PICK_MODEL")} opacity={isGiftSelected ? 1 : 0.3}>
            <SearchField label="Модель" isMenu readOnly>
              <Text px="12px" h="44px" lineHeight="44px" fontSize="13px" fontWeight="700" isTruncated>{form.model}</Text>
            </SearchField>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={2} spacing={3}>
          <Box onClick={() => setView("PICK_PATTERN")}>
            <SearchField label="Узор" isMenu readOnly>
              <Text px="12px" h="44px" lineHeight="44px" fontSize="13px" fontWeight="700" isTruncated>{form.pattern}</Text>
            </SearchField>
          </Box>
          <Box onClick={() => setView("PICK_BACKDROP")}>
            <SearchField label="Фон" isMenu readOnly>
              <Text px="12px" h="44px" lineHeight="44px" fontSize="13px" fontWeight="700" isTruncated>{form.backdropObj?.name || "Любой"}</Text>
            </SearchField>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={2} spacing={3} alignItems="flex-end">
          <SearchField
            label="Номер #"
            placeholder="Любой"
            type="number"
            value={form.number}
            onChange={(e) => setForm(p => ({ ...p, number: e.target.value }))}
          />
          <Button
            h="44px"
            bg="brand.500"
            color="black"
            borderRadius="14px"
            fontWeight="900"
            fontSize="13px"
            isDisabled={!isGiftSelected}
            _active={{ transform: "scale(0.96)" }}
          >
            НАЙТИ
          </Button>
        </SimpleGrid>
      </VStack>
    </VStack>
  )
}