import React, { useState, useEffect, useMemo } from "react";
import { VStack, SimpleGrid, Button, Box, Text, Flex, Spinner, Center, Image, AspectRatio, Select } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";

import { ChangesService } from "../../../services/changes.service";
import { InventoryService } from "../../../services/inventory.service";
import { GiftPreview } from "./GiftPreview";
import { SearchField } from "./SearchField";
import { AttributePicker } from "./AttributePicker";
import { Pagination } from "../../Home/Pagination";

const PAGE_SIZE = 20;

export const NftSearchSection: React.FC<{ onGiftClick: (slug: string, num: number) => void }> = ({ onGiftClick }) => {
  const [view, setView] = useState<"FORM" | "PICK_GIFT" | "PICK_MODEL" | "PICK_PATTERN" | "PICK_BACKDROP">("FORM");

  const [form, setForm] = useState({
    gift: "Все подарки",
    model: "Любая модель",
    pattern: "Любой узор",
    backdropObj: null as any,
    number: "",
    sortBy: "newest",
  });

  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [allGifts, setAllGifts] = useState<string[]>([]);
  const [attributes, setAttributes] = useState({ models: [], patterns: [], backdrops: [], loading: false });

  const isGiftSelected = form.gift !== "Все подарки";

  useEffect(() => {
    ChangesService.getGifts().then(setAllGifts);
  }, []);

  useEffect(() => {
    if (isGiftSelected) {
      setAttributes(prev => ({ ...prev, loading: true }));
      Promise.all([
        ChangesService.getModels(form.gift),
        ChangesService.getPatterns(form.gift),
        ChangesService.getBackdrops(form.gift),
      ]).then(([models, patterns, backdrops]) => {
        setAttributes({ models, patterns, backdrops, loading: false });
      });
    }
  }, [form.gift, isGiftSelected]);

  const previewData = useMemo(() => {
    if (!isGiftSelected) return null;
    return {
      modelUrl: ChangesService.getModelUrl(form.gift, form.model, "json"),
      patternUrl: form.pattern !== "Любой узор" ? ChangesService.getPatternImage(form.gift, form.pattern) : null,
      bg: form.backdropObj ? {
        center: form.backdropObj.hex.centerColor,
        edge: form.backdropObj.hex.edgeColor,
        pattern: form.backdropObj.hex.patternColor,
      } : null,
    };
  }, [form, isGiftSelected]);

  const handleSearch = async (targetPage: number = 1) => {
    setIsSearching(true);
    setHasSearched(true);
    setPage(targetPage);

    const request: any = {
      limit: PAGE_SIZE,
      offset: (targetPage - 1) * PAGE_SIZE,
      sortBy: form.sortBy,
    };

    if (form.number.trim()) {
        if (/^\d+$/.test(form.number)) request.giftId = parseInt(form.number);
        else request.query = form.number;
    }

    if (isGiftSelected) {
        request.query = request.query ? `${form.gift} ${request.query}` : form.gift;
    }

    if (form.model !== "Любая модель") request.models = [form.model];
    if (form.pattern !== "Любой узор") request.symbols = [form.pattern];
    if (form.backdropObj) request.backdrops = [form.backdropObj.name];

    try {
      const data = await InventoryService.searchGifts(request);
      setResults(data.items);
      setTotal(data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setForm({ gift: "Все подарки", model: "Любая модель", pattern: "Любой узор", backdropObj: null, number: "", sortBy: "newest" });
    setResults([]);
    setHasSearched(false);
  };

  if (view !== "FORM") {
    const items = view === "PICK_GIFT" ? allGifts : view === "PICK_MODEL" ? attributes.models : view === "PICK_PATTERN" ? attributes.patterns : attributes.backdrops;
    return (
      <AttributePicker
        title={view.replace("PICK_", "")}
        items={items}
        isLoading={attributes.loading}
        onBack={() => setView("FORM")}
        onSelect={(item) => {
          const val = typeof item === 'string' ? item : item.name;
          setForm(prev => ({
            ...prev,
            gift: view === "PICK_GIFT" ? val : prev.gift,
            model: view === "PICK_GIFT" ? "Любая модель" : (view === "PICK_MODEL" ? val : prev.model),
            pattern: view === "PICK_PATTERN" ? val : prev.pattern,
            backdropObj: view === "PICK_BACKDROP" ? item : prev.backdropObj,
          }));
          setView("FORM");
        }}
        getImageUrl={(n) => {
            if (view === "PICK_GIFT") return ChangesService.getOriginalUrl(n, "png");
            if (view === "PICK_MODEL") return ChangesService.getModelUrl(form.gift, n, "png");
            return ChangesService.getPatternImage(form.gift, n) || "";
        }}
      />
    );
  }

  return (
    <VStack spacing={5} align="stretch">
      <Flex justify="space-between" align="center">
         <Text fontSize="11px" fontWeight="900" color="whiteAlpha.400">NFT BUILDER</Text>
         <Button size="xs" variant="ghost" color="brand.500" leftIcon={<RepeatIcon />} onClick={handleReset}>СБРОС</Button>
      </Flex>

      <GiftPreview
        giftName={form.gift}
        isSelected={isGiftSelected}
        modelUrl={previewData?.modelUrl}
        patternUrl={previewData?.patternUrl}
        bg={previewData?.bg}
      />

      <VStack spacing={3}>
        <SimpleGrid columns={2} spacing={3} w="full">
          <Box onClick={() => setView("PICK_GIFT")} flex={1}>
            <SearchField label="Подарок" isMenu readOnly>
               <Text px={4} fontSize="14px" fontWeight="800" isTruncated>{form.gift}</Text>
            </SearchField>
          </Box>
          <Box onClick={() => isGiftSelected && setView("PICK_MODEL")} flex={1} opacity={isGiftSelected ? 1 : 0.4}>
            <SearchField label="Модель" isMenu readOnly>
               <Text px={4} fontSize="14px" fontWeight="800" isTruncated>{form.model}</Text>
            </SearchField>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={2} spacing={3} w="full">
          <Box onClick={() => isGiftSelected && setView("PICK_PATTERN")} flex={1} opacity={isGiftSelected ? 1 : 0.4}>
            <SearchField label="Узор" isMenu readOnly>
               <Text px={4} fontSize="14px" fontWeight="800" isTruncated>{form.pattern}</Text>
            </SearchField>
          </Box>
          <Box onClick={() => isGiftSelected && setView("PICK_BACKDROP")} flex={1} opacity={isGiftSelected ? 1 : 0.4}>
            <SearchField label="Фон" isMenu readOnly>
               <Text px={4} fontSize="14px" fontWeight="800" isTruncated>{form.backdropObj?.name || "Любой"}</Text>
            </SearchField>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={2} spacing={3} w="full" alignItems="flex-end">
            <SearchField label="ID / ПОИСК" placeholder="#123..." value={form.number} onChange={e => setForm({...form, number: e.target.value})} />
            <Select h="44px" bg="whiteAlpha.50" border="none" borderRadius="16px" fontSize="14px" fontWeight="800" value={form.sortBy} onChange={e => setForm({...form, sortBy: e.target.value})}>
                <option value="newest" style={{background: '#0F1115'}}>Новые</option>
                <option value="price_asc" style={{background: '#0F1115'}}>Дешевле</option>
                <option value="price_desc" style={{background: '#0F1115'}}>Дороже</option>
            </Select>
        </SimpleGrid>

        <Button w="full" h="56px" bg="brand.500" color="black" fontWeight="900" onClick={() => handleSearch(1)} isLoading={isSearching}>
          НАЙТИ NFT
        </Button>
      </VStack>

      {hasSearched && (
        <Box mt={4}>
           <Text fontSize="11px" fontWeight="900" color="whiteAlpha.400" mb={4}>РЕЗУЛЬТАТЫ ({total})</Text>
           {results.length > 0 ? (
             <SimpleGrid columns={2} spacing={4}>
               {results.map(item => (
                 <Box key={item.id} onClick={() => onGiftClick(item.slug, item.number)}>
                    <AspectRatio ratio={1}>
                        <Box bg="whiteAlpha.50" borderRadius="24px" overflow="hidden" border="1px solid" borderColor="whiteAlpha.100">
                           <Image src={item.image} w="full" h="full" objectFit="cover" />
                           <Box position="absolute" bottom={0} left={0} right={0} p={3} bgGradient="linear(to-t, blackAlpha.800, transparent)">
                              <Text fontSize="12px" fontWeight="900">{item.name}</Text>
                              <Text fontSize="10px" color="brand.500" fontWeight="800">{item.floorPrice} TON</Text>
                           </Box>
                        </Box>
                    </AspectRatio>
                 </Box>
               ))}
             </SimpleGrid>
           ) : <Center py={10}><Text color="whiteAlpha.300">Ничего не найдено</Text></Center>}
           {total > PAGE_SIZE && <Pagination currentPage={page} totalCount={total} pageSize={PAGE_SIZE} onPageChange={handleSearch} />}
        </Box>
      )}
    </VStack>
  );
};