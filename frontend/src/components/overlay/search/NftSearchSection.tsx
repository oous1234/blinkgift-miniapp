import React from "react";
import { VStack, SimpleGrid, Button, Box, Text, Flex, Image, AspectRatio, Select, Center } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { useNftSearchLogic } from "../../../hooks/useNftSearchLogic";
import { GiftPreview } from "./GiftPreview";
import { SearchField } from "./SearchField";
import { AttributePicker } from "./AttributePicker";
import { Pagination } from "../../Home/Pagination";
import { ChangesService } from "../../../services/changes.service";

export const NftSearchSection: React.FC<{ onGiftClick: (slug: string, num: number) => void }> = ({ onGiftClick }) => {
  const logic = useNftSearchLogic(onGiftClick);

  if (logic.view !== "FORM") {
    const items = logic.view === "PICK_GIFT" ? logic.allGifts :
                 logic.view === "PICK_MODEL" ? logic.attributes.models :
                 logic.view === "PICK_PATTERN" ? logic.attributes.patterns : logic.attributes.backdrops;

    return (
      <AttributePicker
        title={logic.view.replace("PICK_", "")}
        items={items}
        isLoading={logic.attributes.loading}
        selectedItem={
          logic.view === "PICK_GIFT" ? logic.form.gift :
          logic.view === "PICK_MODEL" ? logic.form.model :
          logic.view === "PICK_PATTERN" ? logic.form.pattern : logic.form.backdropObj?.name
        }
        onBack={() => logic.setView("FORM")}
        onSelect={(item) => {
          const val = typeof item === 'string' ? item : item.name;
          if (logic.view === "PICK_GIFT") {
            logic.setForm(prev => ({ ...prev, gift: val, model: "Любая модель", pattern: "Любой узор", backdropObj: null }));
          } else if (logic.view === "PICK_MODEL") {
            logic.setForm(prev => ({ ...prev, model: val }));
          } else if (logic.view === "PICK_PATTERN") {
            logic.setForm(prev => ({ ...prev, pattern: val }));
          } else if (logic.view === "PICK_BACKDROP") {
            logic.setForm(prev => ({ ...prev, backdropObj: item }));
          }
          logic.setView("FORM");
        }}
        getImageUrl={(n) => {
          if (logic.view === "PICK_GIFT") return ChangesService.getOriginalImage(n);
          if (logic.view === "PICK_MODEL") return ChangesService.getModelUrl(logic.form.gift, n, "png");
          return ChangesService.getPatternImage(logic.form.gift, n) || "";
        }}
      />
    );
  }

  return (
    <VStack spacing={5} align="stretch">
      <Flex justify="space-between" align="center">
         <Text fontSize="11px" fontWeight="900" color="whiteAlpha.400">NFT BUILDER</Text>
         <Button size="xs" variant="ghost" color="brand.500" leftIcon={<RepeatIcon />} onClick={logic.handleReset}>СБРОС</Button>
      </Flex>

      <GiftPreview
        giftName={logic.form.gift}
        isSelected={logic.isGiftSelected}
        modelUrl={logic.previewData?.modelUrl}
        patternUrl={logic.previewData?.patternUrl}
        bg={logic.previewData?.bg}
      />

      <VStack spacing={3}>
        <SimpleGrid columns={2} spacing={3} w="full">
          <Box onClick={() => logic.setView("PICK_GIFT")} flex={1}>
            <SearchField label="Подарок" isMenu readOnly>
               <Text px={4} fontSize="14px" fontWeight="800" isTruncated>{logic.form.gift}</Text>
            </SearchField>
          </Box>
          <Box onClick={() => logic.isGiftSelected && logic.setView("PICK_MODEL")} flex={1} opacity={logic.isGiftSelected ? 1 : 0.4}>
            <SearchField label="Модель" isMenu readOnly>
               <Text px={4} fontSize="14px" fontWeight="800" isTruncated>{logic.form.model}</Text>
            </SearchField>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={2} spacing={3} w="full">
          <Box onClick={() => logic.isGiftSelected && logic.setView("PICK_PATTERN")} flex={1} opacity={logic.isGiftSelected ? 1 : 0.4}>
            <SearchField label="Узор" isMenu readOnly>
               <Text px={4} fontSize="14px" fontWeight="800" isTruncated>{logic.form.pattern}</Text>
            </SearchField>
          </Box>
          <Box onClick={() => logic.isGiftSelected && logic.setView("PICK_BACKDROP")} flex={1} opacity={logic.isGiftSelected ? 1 : 0.4}>
            <SearchField label="Фон" isMenu readOnly>
               <Text px={4} fontSize="14px" fontWeight="800" isTruncated>{logic.form.backdropObj?.name || "Любой"}</Text>
            </SearchField>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={2} spacing={3} w="full" alignItems="flex-end">
            <SearchField
              label="ID / ПОИСК"
              placeholder="#123..."
              value={logic.form.number}
              onChange={e => logic.updateForm("number", e.target.value)}
            />
            <Select
              h="44px" bg="whiteAlpha.50" border="none" borderRadius="16px" fontSize="14px" fontWeight="800"
              value={logic.form.sortBy} onChange={e => logic.updateForm("sortBy", e.target.value)}
            >
                <option value="newest">Новые</option>
                <option value="price_asc">Дешевле</option>
                <option value="price_desc">Дороже</option>
            </Select>
        </SimpleGrid>

        <Button w="full" h="56px" variant="brand" onClick={() => logic.handleSearch(1)} isLoading={logic.isSearching}>
          НАЙТИ NFT
        </Button>
      </VStack>

      {logic.hasSearched && (
        <Box mt={4}>
           <Text fontSize="11px" fontWeight="900" color="whiteAlpha.400" mb={4}>РЕЗУЛЬТАТЫ ({logic.total})</Text>
           {logic.results.length > 0 ? (
             <SimpleGrid columns={2} spacing={4}>
               {logic.results.map(item => (
                 <Box key={item.id} onClick={() => onGiftClick(item.slug, item.number)}>
                    <AspectRatio ratio={1}>
                        <Box bg="whiteAlpha.50" borderRadius="24px" overflow="hidden" border="1px solid" borderColor="whiteAlpha.100">
                           <Image src={item.image} w="full" h="full" objectFit="cover" />
                           <Box position="absolute" bottom={0} left={0} right={0} p={3} bgGradient="linear(to-t, blackAlpha.800, transparent)">
                              <Text fontSize="12px" fontWeight="900" isTruncated>{item.name}</Text>
                              <Text fontSize="10px" color="brand.500" fontWeight="800">{item.floorPrice} TON</Text>
                           </Box>
                        </Box>
                    </AspectRatio>
                 </Box>
               ))}
             </SimpleGrid>
           ) : <Center py={10}><Text color="whiteAlpha.300">Ничего не найдено</Text></Center>}

           {logic.total > 20 && (
             <Pagination
               currentPage={logic.page}
               totalCount={logic.total}
               pageSize={20}
               onPageChange={logic.handleSearch}
             />
           )}
        </Box>
      )}
    </VStack>
  );
};