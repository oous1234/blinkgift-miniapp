import React, { useState, useEffect } from "react";
import {
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  VStack, HStack, Text, Box, Button, Input, SimpleGrid, IconButton, Flex, Badge, Divider,
  Switch, useToast
} from "@chakra-ui/react";
import { ChevronRightIcon, DeleteIcon, AddIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useSniperStore } from "../../../store/useSniperStore";
import { SniperRule } from "../../../types/sniper";
import { AttributePicker } from "../../../components/overlay/search/AttributePicker";
import ChangesService from "../../../services/changes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type ViewType = "LIST" | "EDITOR" | "PICKER";

export const SniperFilterDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const { rules, addRule, updateRule, deleteRule } = useSniperStore();
  const [view, setView] = useState<ViewType>("LIST");
  const [activeRule, setActiveRule] = useState<SniperRule | null>(null);

  // Конфиг для пикера (чтобы картинки грузились правильно)
  const [pickerType, setPickerType] = useState<"gift" | "model" | "backdrop" | "symbol">("gift");
  const [pickerItems, setPickerItems] = useState<any[]>([]);
  const [isPickerLoading, setIsPickerLoading] = useState(false);

  const toast = useToast();

  const handleCreateNew = () => {
    const newRule: SniperRule = {
      id: Math.random().toString(36).substr(2, 9),
      giftName: "Все подарки",
      models: [], backdrops: [], symbols: [], rarities: [],
      minPrice: null, maxPrice: null, minProfitPercent: 10,
      enabled: true
    };
    setActiveRule(newRule);
    setView("EDITOR");
  };

  const handleEdit = (rule: SniperRule) => {
    setActiveRule({ ...rule });
    setView("EDITOR");
  };

  const saveRule = () => {
    if (!activeRule) return;
    const exists = rules.find(r => r.id === activeRule.id);
    if (exists) {
      updateRule(activeRule.id, activeRule);
    } else {
      addRule(activeRule);
    }
    setView("LIST");
    toast({ title: "Слот сохранен", status: "success", duration: 2000 });
  };

  const openPicker = async (type: "gift" | "model" | "backdrop" | "symbol") => {
    setPickerType(type);
    setIsPickerLoading(true);
    setView("PICKER");

    try {
      let items: any[] = [];
      if (type === "gift") items = await ChangesService.getGifts();
      else {
        const giftContext = activeRule?.giftName === "Все подарки" ? "Plush Pepe" : activeRule?.giftName;
        if (type === "model") items = await ChangesService.getModels(giftContext!);
        if (type === "backdrop") items = await ChangesService.getBackdrops(giftContext!);
        if (type === "symbol") items = await ChangesService.getPatterns(giftContext!);
      }
      setPickerItems(items);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPickerLoading(false);
    }
  };

  const toggleAttribute = (key: keyof SniperRule, value: string) => {
    if (!activeRule) return;
    const current = (activeRule[key] as string[]) || [];
    const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    setActiveRule({ ...activeRule, [key]: next });
  };

  // Функция для получения URL картинок (как в NFT Search)
  const getImageUrl = (item: any) => {
    const name = typeof item === "string" ? item : item.name;
    const giftContext = activeRule?.giftName === "Все подарки" ? "Plush Pepe" : activeRule?.giftName;

    if (pickerType === "gift") return ChangesService.getOriginalUrl(name, "png");
    if (pickerType === "model") return ChangesService.getModelUrl(giftContext!, name, "png");
    if (pickerType === "symbol") return ChangesService.getPatternImage(giftContext!, name);
    return "";
  };

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay backdropFilter="blur(12px)" bg="blackAlpha.800" />
      <DrawerContent bg="#0A0C10" borderTopRadius="32px" height="85vh" color="white" borderTop="1px solid" borderColor="whiteAlpha.200">
        <DrawerBody p={0}>
          <AnimatePresence mode="wait">
            {view === "LIST" && (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }} // Убрали пружинку
                style={{ padding: '24px' }}
              >
                <Flex justify="space-between" align="center" mb={6}>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="900" fontSize="14px" color="whiteAlpha.600" letterSpacing="1px">АКТИВНЫЕ СЛОТЫ</Text>
                    <Text fontSize="10px" color="brand.500" fontWeight="bold">СИСТЕМА: ЗАПУЩЕНА</Text>
                  </VStack>
                  <DrawerCloseButton position="static" />
                </Flex>

                <VStack spacing={3} align="stretch" maxH="55vh" overflowY="auto">
                  {rules.length === 0 && (
                    <Box py={10} textAlign="center" border="1px dashed" borderColor="whiteAlpha.200" borderRadius="20px">
                      <Text color="whiteAlpha.400" fontSize="12px">Нет активных слотов для поиска</Text>
                    </Box>
                  )}
                  {rules.map(r => (
                    <Flex key={r.id} bg="whiteAlpha.50" p={4} borderRadius="18px" align="center" border="1px solid" borderColor="whiteAlpha.100" onClick={() => handleEdit(r)} cursor="pointer">
                       <VStack align="start" spacing={0} flex={1}>
                          <HStack>
                             <Text fontWeight="900" fontSize="15px">{r.giftName}</Text>
                             {!r.enabled && <Badge colorScheme="red" variant="subtle" fontSize="8px">ВЫКЛ</Badge>}
                          </HStack>
                          <Text fontSize="10px" color="whiteAlpha.500" fontWeight="bold">
                            {r.models.length + r.backdrops.length + r.symbols.length} АТТР • МАКС {r.maxPrice || '∞'} TON
                          </Text>
                       </VStack>
                       <ChevronRightIcon color="whiteAlpha.300" />
                    </Flex>
                  ))}
                </VStack>

                <Button
                  mt={6} w="100%" h="56px" bg="white" color="black" borderRadius="18px" fontWeight="900" fontSize="14px" leftIcon={<AddIcon boxSize="10px"/>}
                  onClick={handleCreateNew}
                >
                  СОЗДАТЬ НОВЫЙ СЛОТ
                </Button>
              </motion.div>
            )}

            {view === "EDITOR" && activeRule && (
              <motion.div
                key="editor"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }} // Убрали пружинку
                style={{ padding: '24px' }}
              >
                <HStack mb={6} justify="space-between">
                  <IconButton aria-label="back" icon={<ArrowBackIcon />} variant="ghost" size="sm" onClick={() => setView("LIST")} />
                  <Text fontWeight="900" fontSize="14px" letterSpacing="1px">НАСТРОЙКА СЛОТА</Text>
                  <IconButton aria-label="del" icon={<DeleteIcon />} variant="ghost" colorScheme="red" size="sm" onClick={() => { deleteRule(activeRule.id); setView("LIST"); }} />
                </HStack>

                <VStack spacing={4} align="stretch">
                  <Box bg="whiteAlpha.50" p={3} borderRadius="16px" onClick={() => openPicker("gift")}>
                    <Text fontSize="9px" fontWeight="bold" color="whiteAlpha.400" mb={1}>ПРЕДМЕТ / КОЛЛЕКЦИЯ</Text>
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="800" fontSize="16px">{activeRule.giftName}</Text>
                      <ChevronRightIcon color="brand.500" />
                    </Flex>
                  </Box>

                  <SimpleGrid columns={3} spacing={2}>
                    <MiniAttr label="Модели" count={activeRule.models.length} onClick={() => openPicker("model")} />
                    <MiniAttr label="Фоны" count={activeRule.backdrops.length} onClick={() => openPicker("backdrop")} />
                    <MiniAttr label="Узоры" count={activeRule.symbols.length} onClick={() => openPicker("symbol")} />
                  </SimpleGrid>

                  <Divider borderColor="whiteAlpha.100" my={2} />

                  <HStack spacing={4}>
                    <Box flex={1}>
                       <Text fontSize="9px" fontWeight="bold" color="whiteAlpha.400" mb={1}>МИН. ЦЕНА</Text>
                       <Input
                        placeholder="0" variant="filled" bg="whiteAlpha.100" border="none" borderRadius="12px" fontWeight="900"
                        value={activeRule.minPrice || ""} onChange={e => setActiveRule({...activeRule, minPrice: Number(e.target.value)})}
                       />
                    </Box>
                    <Box flex={1}>
                       <Text fontSize="9px" fontWeight="bold" color="whiteAlpha.400" mb={1}>МАКС. ЦЕНА</Text>
                       <Input
                        placeholder="∞" variant="filled" bg="whiteAlpha.100" border="none" borderRadius="12px" fontWeight="900"
                        value={activeRule.maxPrice || ""} onChange={e => setActiveRule({...activeRule, maxPrice: Number(e.target.value)})}
                       />
                    </Box>
                  </HStack>

                  <Box bg="rgba(76, 217, 100, 0.05)" p={4} borderRadius="18px" border="1px solid" borderColor="rgba(76, 217, 100, 0.2)">
                    <Flex justify="space-between" align="center" mb={2}>
                       <Text fontSize="11px" fontWeight="900" color="#4CD964">МИНИМАЛЬНЫЙ ПРОФИТ (%)</Text>
                       <Text fontSize="14px" fontWeight="900" color="#4CD964">+{activeRule.minProfitPercent}%</Text>
                    </Flex>
                    <Input
                      type="range" min="0" max="50" step="5"
                      value={activeRule.minProfitPercent || 0}
                      onChange={e => setActiveRule({...activeRule, minProfitPercent: Number(e.target.value)})}
                    />
                  </Box>

                  <Flex justify="space-between" align="center" bg="whiteAlpha.50" p={3} borderRadius="16px">
                     <Text fontSize="13px" fontWeight="800">Статус активности</Text>
                     <Switch isChecked={activeRule.enabled} onChange={e => setActiveRule({...activeRule, enabled: e.target.checked})} colorScheme="purple" />
                  </Flex>

                  <Button h="56px" bg="brand.500" color="black" fontWeight="900" borderRadius="16px" mt={4} onClick={saveRule}>
                    СОХРАНИТЬ КОНФИГУРАЦИЮ
                  </Button>
                </VStack>
              </motion.div>
            )}

            {view === "PICKER" && (
               <motion.div
                key="picker"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{ height: '85vh' }}
               >
                  <AttributePicker
                    title={pickerType === "gift" ? "Выберите подарок" : pickerType === "model" ? "Выберите модели" : pickerType === "symbol" ? "Выберите узоры" : "Выберите фоны"}
                    items={pickerItems}
                    selectedItems={(activeRule as any)[pickerType === 'gift' ? 'giftName' : pickerType + 's']}
                    onBack={() => setView("EDITOR")}
                    isLoading={isPickerLoading}
                    getImageUrl={getImageUrl}
                    onSelect={(item) => {
                      const val = typeof item === 'string' ? item : item.name;
                      if (pickerType === 'gift') {
                        setActiveRule({ ...activeRule!, giftName: val, models: [], backdrops: [], symbols: [] });
                        setView("EDITOR");
                      } else {
                        toggleAttribute((pickerType + 's') as any, val);
                      }
                    }}
                    renderCustomItem={pickerType === "backdrop" ? (item: any) => (
                      <Box boxSize="40px" borderRadius="full" style={{ background: `radial-gradient(circle, ${item.hex?.centerColor} 0%, ${item.hex?.edgeColor} 100%)` }} />
                    ) : undefined}
                  />
               </motion.div>
            )}
          </AnimatePresence>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const MiniAttr = ({ label, count, onClick }: any) => (
  <VStack
    bg="whiteAlpha.100" p={2} borderRadius="12px" cursor="pointer" spacing={0} align="start" border="1px solid" borderColor="whiteAlpha.50"
    onClick={onClick} _active={{ bg: "whiteAlpha.200" }}
  >
    <Text fontSize="8px" fontWeight="bold" color="whiteAlpha.400">{label === 'Models' ? 'МОДЕЛИ' : label === 'Backdrops' ? 'ФОНЫ' : 'УЗОРЫ'}</Text>
    <Text fontSize="12px" fontWeight="900" color={count > 0 ? "brand.500" : "white"}>{count > 0 ? count : 'ВСЕ'}</Text>
  </VStack>
);