import React, { useState, useEffect, useMemo } from "react"
import {
  VStack, SimpleGrid, Button, Box, Text, Input, InputGroup,
  InputLeftElement, HStack, Image, Spinner, Collapse, Center, AspectRatio,
} from "@chakra-ui/react"
import { SearchIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { SearchField } from "./SearchField"
import { AttributePicker } from "./AttributePicker"
import ChangesService, { ApiBackdrop } from "../../services/changes"

type ViewState = "FORM" | "PICK_MODEL" | "PICK_PATTERN" | "PICK_BACKDROP"

// Фиксированные координаты для 13 иконок узора (как в TG)
const PATTERN_POSITIONS = [
  { top: "10%", left: "15%", rotate: "-15deg" },
  { top: "12%", left: "50%", rotate: "10deg" },
  { top: "15%", left: "85%", rotate: "25deg" },
  { top: "35%", left: "25%", rotate: "-10deg" },
  { top: "40%", left: "65%", rotate: "20deg" },
  { top: "65%", left: "10%", rotate: "15deg" },
  { top: "60%", left: "45%", rotate: "-20deg" },
  { top: "65%", left: "80%", rotate: "5deg" },
  { top: "85%", left: "20%", rotate: "-5deg" },
  { top: "80%", left: "55%", rotate: "15deg" },
  { top: "88%", left: "85%", rotate: "-15deg" },
  { top: "30%", left: "90%", rotate: "30deg" },
  { top: "90%", left: "50%", rotate: "0deg" },
];

export const NftSearchSection = () => {
  const [view, setView] = useState<ViewState>("FORM")
  const [showGifts, setShowGifts] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const [allGifts, setAllGifts] = useState<string[]>([])
  const [models, setModels] = useState<string[]>([])
  const [patterns, setPatterns] = useState<string[]>([])
  const [backdrops, setBackdrops] = useState<ApiBackdrop[]>([])

  const [isLoadingGifts, setIsLoadingGifts] = useState(false)
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [isLoadingPatterns, setIsLoadingPatterns] = useState(false)
  const [isLoadingBackdrops, setIsLoadingBackdrops] = useState(false)

  const [form, setForm] = useState({
    gift: "Все подарки",
    model: "Любая модель",
    pattern: "Любой узор",
    backdropObj: null as ApiBackdrop | null,
    number: ""
  })

  const isGiftSelected = form.gift !== "Все подарки"

  useEffect(() => {
    if (showGifts && allGifts.length === 0) {
      setIsLoadingGifts(true)
      ChangesService.getGifts().then(data => { setAllGifts(data); setIsLoadingGifts(false); })
    }
  }, [showGifts])

  useEffect(() => {
    if (isGiftSelected) {
      setIsLoadingModels(true); setIsLoadingPatterns(true); setIsLoadingBackdrops(true);
      ChangesService.getModels(form.gift).then(data => { setModels(data); setIsLoadingModels(false); })
      ChangesService.getPatterns(form.gift).then(data => { setPatterns(data); setIsLoadingPatterns(false); })
      ChangesService.getBackdrops(form.gift).then(data => { setBackdrops(data); setIsLoadingBackdrops(false); })
    }
  }, [form.gift])

  const previewData = useMemo(() => {
    if (!isGiftSelected) return null
    return {
      modelUrl: form.model === "Любая модель" ? ChangesService.getOriginalImage(form.gift) : ChangesService.getModelImage(form.gift, form.model),
      patternUrl: form.pattern !== "Любой узор" ? ChangesService.getPatternImage(form.gift, form.pattern) : null,
      bg: form.backdropObj ? { center: form.backdropObj.hex.centerColor, edge: form.backdropObj.hex.edgeColor, pattern: form.backdropObj.hex.patternColor } : null
    }
  }, [form, isGiftSelected])

  if (view !== "FORM") {
    return (
      <AttributePicker
        title={view === "PICK_MODEL" ? "Выберите модель" : view === "PICK_PATTERN" ? "Выберите узор" : "Выберите фон"}
        items={view === "PICK_MODEL" ? models : view === "PICK_PATTERN" ? patterns : backdrops}
        isLoading={view === "PICK_MODEL" ? isLoadingModels : view === "PICK_PATTERN" ? isLoadingPatterns : isLoadingBackdrops}
        onBack={() => setView("FORM")}
        onSelect={(item) => {
          if (view === "PICK_MODEL") setForm({ ...form, model: item })
          if (view === "PICK_PATTERN") setForm({ ...form, pattern: item })
          if (view === "PICK_BACKDROP") setForm({ ...form, backdropObj: item })
          setView("FORM")
        }}
        getImageUrl={view === "PICK_MODEL" ? (n) => ChangesService.getModelImage(form.gift, n) : view === "PICK_PATTERN" ? (n) => ChangesService.getPatternImage(form.gift, n) : undefined}
        renderCustomItem={view === "PICK_BACKDROP" ? (item: ApiBackdrop) => (
          <Box boxSize="50px" borderRadius="full" style={{ background: `radial-gradient(circle, ${item.hex.centerColor} 0%, ${item.hex.edgeColor} 100%)` }} />
        ) : undefined}
      />
    )
  }

  return (
    <VStack spacing={5} align="stretch">
      {/* КАРТОЧКА ПРЕВЬЮ */}
      <AspectRatio ratio={1} w="100%">
        <Box borderRadius="32px" overflow="hidden" position="relative" bg="#161920" border="1px solid" borderColor="whiteAlpha.100">
          {!isGiftSelected ? (
            <Center h="100%" flexDirection="column" opacity={0.3}>
              <Box boxSize="60px" borderRadius="18px" bg="whiteAlpha.200" mb={3} />
              <Text fontWeight="800" fontSize="14px">Выберите подарок</Text>
            </Center>
          ) : (
            <>
              {/* 1. ФОН (ГРАДИЕНТ) */}
              <Box position="absolute" inset={0} style={{ background: previewData?.bg ? `radial-gradient(circle, ${previewData.bg.center} 0%, ${previewData.bg.edge} 100%)` : "#232323" }} />

              {/* 2. СЕТКА УЗОРОВ (PATTERN LAYER) */}
              {previewData?.patternUrl && (
                <Box position="absolute" inset={0} opacity={0.15}> {/* Прозрачность как в TG */}
                  {PATTERN_POSITIONS.map((pos, idx) => (
                    <Box
                      key={idx}
                      position="absolute"
                      top={pos.top}
                      left={pos.left}
                      transform={`translate(-50%, -50%) rotate(${pos.rotate})`}
                      w="40px"
                      h="40px"
                      style={{
                        maskImage: `url(${previewData.patternUrl})`,
                        WebkitMaskImage: `url(${previewData.patternUrl})`,
                        maskRepeat: "no-repeat",
                        maskSize: "contain",
                        backgroundColor: previewData.bg?.pattern || "white" // Окрашиваем узор в цвет из API
                      }}
                    />
                  ))}
                </Box>
              )}

              {/* 3. МОДЕЛЬ */}
              <Center position="absolute" inset={0}>
                <Image src={previewData?.modelUrl} boxSize="75%" objectFit="contain" />
              </Center>

              <Box position="absolute" bottom={5} left={6}>
                 <Text fontSize="12px" fontWeight="900" color="whiteAlpha.400" textTransform="uppercase" letterSpacing="1px">{form.gift}</Text>
              </Box>
            </>
          )}
        </Box>
      </AspectRatio>

      {/* ПОЛЯ ВЫБОРА */}
      <VStack spacing={4} align="stretch">
        <Box onClick={() => setShowGifts(!showGifts)} cursor="pointer">
          <SearchField label="Подарок" isMenu readOnly>
            <HStack justify="space-between" px="12px" h="48px">
              <Text fontSize="14px" fontWeight="700" isTruncated>{form.gift}</Text>
              <ChevronDownIcon color="gray.500" />
            </HStack>
          </SearchField>
        </Box>

        <Collapse in={showGifts}>
          <Box bg="#1F232E" borderRadius="20px" border="1px solid" borderColor="whiteAlpha.200" maxH="200px" overflowY="auto">
            {allGifts.map(gift => (
              <HStack key={gift} p={3} cursor="pointer" _hover={{bg: "whiteAlpha.100"}} onClick={() => { setForm({ ...form, gift, model: "Любая модель", pattern: "Любой узор", backdropObj: null }); setShowGifts(false); }}>
                <Image src={ChangesService.getOriginalImage(gift)} boxSize="30px" borderRadius="6px" />
                <Text fontSize="14px" fontWeight="600">{gift}</Text>
              </HStack>
            ))}
          </Box>
        </Collapse>

        <VStack spacing={3} align="stretch">
          <Box onClick={() => isGiftSelected && setView("PICK_MODEL")} opacity={isGiftSelected ? 1 : 0.4} cursor={isGiftSelected ? "pointer" : "not-allowed"}>
            <SearchField label="Модель" isMenu readOnly>
              <HStack justify="space-between" px="12px" h="48px"><Text fontSize="14px" fontWeight="700">{form.model}</Text><ChevronDownIcon color="gray.500" /></HStack>
            </SearchField>
          </Box>

          <SimpleGrid columns={2} spacing={3}>
            <Box onClick={() => isGiftSelected && setView("PICK_PATTERN")} opacity={isGiftSelected ? 1 : 0.4}>
              <SearchField label="Узор" isMenu readOnly><Text fontSize="14px" fontWeight="700" isTruncated>{form.pattern}</Text></SearchField>
            </Box>
            <Box onClick={() => isGiftSelected && setView("PICK_BACKDROP")} opacity={isGiftSelected ? 1 : 0.4}>
              <SearchField label="Фон" isMenu readOnly><Text fontSize="14px" fontWeight="700" isTruncated>{form.backdropObj?.name || "Любой фон"}</Text></SearchField>
            </Box>
          </SimpleGrid>
        </VStack>

        <SearchField label="Номер #" placeholder="123" type="number" value={form.number} onChange={(e) => setForm({...form, number: e.target.value})} />

        <Button h="56px" bg="white" color="black" borderRadius="20px" fontWeight="900" isDisabled={!isGiftSelected}>
          Найти NFT
        </Button>
      </VStack>
    </VStack>
  )
}