import React, { useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  Text,
  Box,
  Button,
  Input,
  SimpleGrid,
  IconButton,
  Flex,
  Badge,
  Switch,
  useToast,
} from "@chakra-ui/react";
import { ChevronRightIcon, DeleteIcon, AddIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { motion, AnimatePresence } from "framer-motion";

import { useSniperStore } from "../../../store/useSniperStore";
import { SniperRule } from "../../../types/sniper";
import { AttributePicker } from "../../../components/overlay/search/AttributePicker";
import { ChangesService } from "../../../services/changes.service";
import { Surface } from "../../../components/shared/Surface";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type ViewType = "LIST" | "EDITOR" | "PICKER";

const MiniAttr = ({ label, count, onClick }: any) => (
  <VStack
    bg="whiteAlpha.100"
    p={2}
    borderRadius="12px"
    cursor="pointer"
    spacing={0}
    align="start"
    border="1px solid"
    borderColor="whiteAlpha.50"
    onClick={onClick}
    _active={{ bg: "whiteAlpha.200" }}
  >
    <Text fontSize="8px" fontWeight="bold" color="whiteAlpha.400" textTransform="uppercase">
      {label}
    </Text>
    <Text fontSize="12px" fontWeight="900" color={count > 0 ? "brand.500" : "white"}>
      {count > 0 ? count : "ВСЕ"}
    </Text>
  </VStack>
);

export const SniperFilterDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const { rules, addRule, updateRule, deleteRule } = useSniperStore();
  const [view, setView] = useState<ViewType>("LIST");
  const [activeRule, setActiveRule] = useState<SniperRule | null>(null);
  const [pickerType, setPickerType] = useState<"gift" | "model" | "backdrop" | "symbol">("gift");
  const [pickerItems, setPickerItems] = useState<any[]>([]);
  const [isPickerLoading, setIsPickerLoading] = useState(false);
  const toast = useToast();

  const handleCreateNew = () => {
    const newRule: SniperRule = {
      id: Math.random().toString(36).substr(2, 9),
      giftName: "Все подарки",
      models: [],
      backdrops: [],
      symbols: [],
      rarities: [],
      minPrice: null,
      maxPrice: null,
      minProfitPercent: 10,
      enabled: true,
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
    const exists = rules.find((r) => r.id === activeRule.id);
    if (exists) {
      updateRule(activeRule.id, activeRule);
    } else {
      addRule(activeRule);
    }
    setView("LIST");
    toast({ title: "Сохранено", status: "success", duration: 2000 });
  };

  const openPicker = async (type: "gift" | "model" | "backdrop" | "symbol") => {
    setPickerType(type);
    setIsPickerLoading(true);
    setView("PICKER");
    try {
      let items: any[] = [];
      const giftContext = activeRule?.giftName === "Все подарки" ? "Plush Pepe" : activeRule?.giftName;
      if (type === "gift") {
        items = await ChangesService.getGifts();
      } else if (type === "model") {
        items = await ChangesService.getModels(giftContext!);
      } else if (type === "backdrop") {
        items = await ChangesService.getBackdrops(giftContext!);
      }
      setPickerItems(items);
    } catch (e) {
      setPickerItems([]);
    } finally {
      setIsPickerLoading(false);
    }
  };

  const getImageUrl = (item: any) => {
    const name = typeof item === "string" ? item : item.name;
    const giftContext = activeRule?.giftName === "Все подарки" ? "Plush Pepe" : activeRule?.giftName;
    if (pickerType === "gift") return ChangesService.getModelUrl(name, "Original", "png");
    if (pickerType === "model") return ChangesService.getModelUrl(giftContext!, name, "png");
    return "";
  };

  const toggleAttribute = (key: keyof SniperRule, value: string) => {
    if (!activeRule) return;
    const current = (activeRule[key] as string[]) || [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setActiveRule({ ...activeRule, [key]: next });
  };

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay backdropFilter="blur(12px)" bg="blackAlpha.800" />
      <DrawerContent bg="#0A0C10" borderTopRadius="32px" height="85vh" color="white">
        <DrawerCloseButton zIndex={10} />
        <DrawerBody p={0}>
          <AnimatePresence mode="wait">
            {view === "LIST" && (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ padding: "24px" }}
              >
                <Text fontWeight="900" fontSize="14px" color="whiteAlpha.600" mb={6}>
                  АКТИВНЫЕ СЛОТЫ
                </Text>
                <VStack spacing={3} align="stretch">
                  {rules.map((r) => (
                    <Surface interactive key={r.id} onClick={() => handleEdit(r)} p={4}>
                      <Flex align="center" justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="900">{r.giftName}</Text>
                          <Text fontSize="10px" color="whiteAlpha.500">
                            {r.models.length + r.backdrops.length} АТРИБУТОВ
                          </Text>
                        </VStack>
                        <ChevronRightIcon />
                      </Flex>
                    </Surface>
                  ))}
                  <Button leftIcon={<AddIcon />} onClick={handleCreateNew} mt={4} bg="brand.500" color="black">
                    ДОБАВИТЬ СЛОТ
                  </Button>
                </VStack>
              </motion.div>
            )}

            {view === "EDITOR" && activeRule && (
              <motion.div
                key="editor"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                style={{ padding: "24px" }}
              >
                <HStack mb={6}>
                  <IconButton aria-label="back" icon={<ArrowBackIcon />} onClick={() => setView("LIST")} variant="ghost" />
                  <Text fontWeight="900">НАСТРОЙКА</Text>
                </HStack>
                <VStack spacing={4} align="stretch">
                  <Surface interactive p={3} onClick={() => openPicker("gift")}>
                    <Text fontSize="10px" color="whiteAlpha.400">ПОДАРОК</Text>
                    <Text fontWeight="800">{activeRule.giftName}</Text>
                  </Surface>
                  <SimpleGrid columns={3} spacing={2}>
                    <MiniAttr label="Модели" count={activeRule.models.length} onClick={() => openPicker("model")} />
                    <MiniAttr label="Фоны" count={activeRule.backdrops.length} onClick={() => openPicker("backdrop")} />
                    <MiniAttr label="Узоры" count={activeRule.symbols.length} onClick={() => openPicker("symbol")} />
                  </SimpleGrid>
                  <HStack>
                    <Input placeholder="Мин. цена" type="number" value={activeRule.minPrice || ""} onChange={e => setActiveRule({...activeRule, minPrice: Number(e.target.value)})} />
                    <Input placeholder="Макс. цена" type="number" value={activeRule.maxPrice || ""} onChange={e => setActiveRule({...activeRule, maxPrice: Number(e.target.value)})} />
                  </HStack>
                  <Flex justify="space-between" align="center" bg="whiteAlpha.50" p={3} borderRadius="12px">
                    <Text fontWeight="700">Активен</Text>
                    <Switch isChecked={activeRule.enabled} onChange={e => setActiveRule({...activeRule, enabled: e.target.checked})} />
                  </Flex>
                  <Button colorScheme="purple" onClick={saveRule} h="56px" borderRadius="16px">СОХРАНИТЬ</Button>
                  <Button colorScheme="red" variant="ghost" onClick={() => { deleteRule(activeRule.id); setView("LIST"); }}>УДАЛИТЬ</Button>
                </VStack>
              </motion.div>
            )}

            {view === "PICKER" && (
              <motion.div key="picker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ height: "100%" }}>
                <AttributePicker
                  title="Выбор"
                  items={pickerItems}
                  selectedItems={(activeRule as any)[pickerType === "gift" ? "giftName" : pickerType + "s"]}
                  onBack={() => setView("EDITOR")}
                  isLoading={isPickerLoading}
                  getImageUrl={getImageUrl}
                  onSelect={(item) => {
                    const val = typeof item === "string" ? item : item.name;
                    if (pickerType === "gift") {
                      setActiveRule({ ...activeRule!, giftName: val, models: [], backdrops: [], symbols: [] });
                      setView("EDITOR");
                    } else {
                      toggleAttribute((pickerType + "s") as any, val);
                    }
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};