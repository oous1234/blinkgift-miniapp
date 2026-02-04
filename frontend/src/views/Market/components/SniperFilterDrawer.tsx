import React, { useState, useEffect } from "react"
import {
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  VStack, HStack, Text, Box, Button, Input, SimpleGrid, Switch, Flex, IconButton, Center
} from "@chakra-ui/react"
import { ChevronRightIcon, ArrowBackIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons"
import { motion, AnimatePresence } from "framer-motion"
import { AttributePicker } from "@components/overlay/search/AttributePicker"
import ChangesService, { ApiBackdrop } from "@services/changes"
import { SniperRule } from "../hooks/useSniperLogic"

interface SniperFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  rules: SniperRule[]
  onSave: (rules: SniperRule[]) => void
}

type ViewType = "LIST" | "EDIT" | "PICKER"

export const SniperFilterDrawer: React.FC<SniperFilterDrawerProps> = ({
  isOpen, onClose, rules, onSave
}) => {
  const [view, setView] = useState<ViewType>("LIST")
  const [pickerType, setPickerType] = useState<"GIFT" | "MODEL" | "BACKDROP">("GIFT")
  const [editingRule, setEditingRule] = useState<SniperRule | null>(null)
  const [allGifts, setAllGifts] = useState<string[]>([])
  const [attributes, setAttributes] = useState({
    models: [] as string[],
    backdrops: [] as ApiBackdrop[],
    loading: false
  })

  useEffect(() => {
    if (isOpen) {
      setView("LIST")
      ChangesService.getGifts().then(setAllGifts)
    }
  }, [isOpen])

  useEffect(() => {
    if (editingRule && editingRule.giftName !== "Все подарки") {
      setAttributes(prev => ({ ...prev, loading: true }))
      Promise.all([
        ChangesService.getModels(editingRule.giftName),
        ChangesService.getBackdrops(editingRule.giftName),
      ]).then(([m, b]) => {
        setAttributes({ models: m as any, backdrops: b as any, loading: false })
      })
    }
  }, [editingRule?.giftName])

  const handleAdd = () => {
    setEditingRule({
      id: Math.random().toString(36).substr(2, 9),
      giftName: "Все подарки",
      models: [],
      backdrops: [],
      minPrice: "",
      maxPrice: "",
      minDiscount: "",
      enabled: true
    })
    setView("EDIT")
  }

  const handleSave = () => {
    if (!editingRule) return
    onSave(rules.find(r => r.id === editingRule.id)
      ? rules.map(r => r.id === editingRule.id ? editingRule : r)
      : [...rules, editingRule])
    setView("LIST")
  }

  const toggleAttr = (list: string[], val: string) =>
    list.includes(val) ? list.filter(v => v !== val) : [...list, val]

  // Подготовка данных для пикера
  const pickerConfig = editingRule ? {
    GIFT: { items: allGifts, title: "Выбор предмета", getImg: (n: string) => ChangesService.getOriginalUrl(n, "png"), selected: [editingRule.giftName] },
    MODEL: { items: attributes.models, title: "Выбор моделей", getImg: (n: string) => ChangesService.getModelUrl(editingRule.giftName, n, "png"), selected: editingRule.models },
    BACKDROP: { items: attributes.backdrops, title: "Выбор фонов", selected: editingRule.backdrops },
  }[pickerType] : null

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay backdropFilter="blur(10px)" bg="blackAlpha.700" />
      <DrawerContent bg="#0F1115" borderTopRadius="28px" height="84vh" color="white">
        <DrawerBody p={0} display="flex" flexDirection="column">
          <AnimatePresence mode="wait">
            {/* СПИСОК СЛОТОВ */}
            {view === "LIST" && (
              <motion.div key="list" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} style={{ height: '100%', padding: '20px' }}>
                <Flex justify="space-between" align="center" mb={6}>
                  <Text fontSize="11px" fontWeight="900" color="whiteAlpha.400" letterSpacing="1px">АКТИВНЫЕ СЛОТЫ ({rules.length})</Text>
                  <DrawerCloseButton position="static" size="sm" />
                </Flex>
                <VStack align="stretch" spacing={2} overflowY="auto" maxH="calc(84vh - 160px)">
                  {rules.length === 0 ? (
                    <Center py={14} bg="whiteAlpha.50" borderRadius="20px" border="1px dashed" borderColor="whiteAlpha.100">
                      <Text color="whiteAlpha.300" fontSize="12px" fontWeight="700">НЕТ АКТИВНЫХ КОНФИГОВ</Text>
                    </Center>
                  ) : (
                    rules.map(rule => (
                      <HStack key={rule.id} bg="rgba(255,255,255,0.03)" p={3} borderRadius="16px" border="1px solid" borderColor="whiteAlpha.50" justify="space-between">
                        <VStack align="start" spacing={0} flex={1} onClick={() => { setEditingRule(rule); setView("EDIT"); }} cursor="pointer">
                          <Text fontWeight="800" fontSize="14px">{rule.giftName}</Text>
                          <Text fontSize="10px" color="brand.500" fontWeight="800">{rule.models.length + rule.backdrops.length} АТТР • ДО {rule.maxPrice || '∞'} TON</Text>
                        </VStack>
                        <IconButton aria-label="Del" icon={<DeleteIcon />} variant="ghost" color="whiteAlpha.300" size="sm" onClick={() => onSave(rules.filter(r => r.id !== rule.id))} />
                      </HStack>
                    ))
                  )}
                </VStack>
                <Button position="absolute" bottom="30px" left="20px" right="20px" h="48px" borderRadius="14px" bg="brand.500" color="black" fontWeight="900" fontSize="13px" leftIcon={<AddIcon boxSize="10px" />} onClick={handleAdd}>СОЗДАТЬ СЛОТ</Button>
              </motion.div>
            )}

            {/* РЕДАКТИРОВАНИЕ СЛОТА */}
            {view === "EDIT" && (
              <motion.div key="edit" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} style={{ height: '100%', padding: '20px' }}>
                <HStack justify="space-between" mb={6}>
                  <IconButton aria-label="back" icon={<ArrowBackIcon />} onClick={() => setView("LIST")} variant="ghost" size="sm" />
                  <Text fontWeight="900" fontSize="14px" letterSpacing="0.5px">НАСТРОЙКА СЛОТА</Text>
                  <Box w="32px" />
                </HStack>
                <VStack spacing={5} align="stretch">
                  <Box>
                    <Text fontSize="9px" fontWeight="900" color="whiteAlpha.400" mb={1} ml={1}>КОЛЛЕКЦИЯ / ПРЕДМЕТ</Text>
                    <Button w="100%" h="48px" borderRadius="14px" bg="whiteAlpha.50" justifyContent="space-between" fontSize="14px" fontWeight="800" onClick={() => { setPickerType("GIFT"); setView("PICKER"); }}>
                      {editingRule?.giftName} <ChevronRightIcon color="whiteAlpha.300" />
                    </Button>
                  </Box>
                  <SimpleGrid columns={2} spacing={3}>
                    <CompactAttr label="Модели" count={editingRule?.models.length || 0} onClick={() => { setPickerType("MODEL"); setView("PICKER"); }} isDisabled={editingRule?.giftName === "Все подарки"} />
                    <CompactAttr label="Фоны" count={editingRule?.backdrops.length || 0} onClick={() => { setPickerType("BACKDROP"); setView("PICKER"); }} isDisabled={editingRule?.giftName === "Все подарки"} />
                  </SimpleGrid>
                  <HStack spacing={3}>
                    <Box flex={1}>
                      <Text fontSize="9px" fontWeight="900" color="whiteAlpha.400" mb={1} ml={1}>МИН. ЦЕНА</Text>
                      <Input placeholder="0" bg="whiteAlpha.50" border="none" h="48px" borderRadius="14px" fontSize="14px" fontWeight="800" value={editingRule?.minPrice} onChange={e => setEditingRule(prev => prev ? {...prev, minPrice: e.target.value} : null)} />
                    </Box>
                    <Box flex={1}>
                      <Text fontSize="9px" fontWeight="900" color="whiteAlpha.400" mb={1} ml={1}>МАКС. ЦЕНА</Text>
                      <Input placeholder="∞" bg="whiteAlpha.50" border="none" h="48px" borderRadius="14px" fontSize="14px" fontWeight="800" value={editingRule?.maxPrice} onChange={e => setEditingRule(prev => prev ? {...prev, maxPrice: e.target.value} : null)} />
                    </Box>
                  </HStack>
                  <Button position="absolute" bottom="30px" left="20px" right="20px" h="52px" borderRadius="16px" bg="brand.500" color="black" fontWeight="900" fontSize="14px" onClick={handleSave}>СОХРАНИТЬ КОНФИГ</Button>
                </VStack>
              </motion.div>
            )}

            {/* ВЫБОР АТРИБУТОВ (PICKER) */}
            {view === "PICKER" && pickerConfig && (
              <motion.div key="picker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box flex={1} overflow="hidden">
                  <AttributePicker
                    title={pickerConfig.title}
                    items={pickerConfig.items}
                    selectedItems={pickerConfig.selected}
                    onBack={() => setView("EDIT")}
                    isLoading={attributes.loading && pickerType !== "GIFT"}
                    getImageUrl={pickerConfig.getImg}
                    renderCustomItem={pickerType === "BACKDROP" ? (item: any) => (
                      <Box boxSize="40px" borderRadius="full" style={{ background: `radial-gradient(circle, ${item.hex?.centerColor || '#333'} 0%, ${item.hex?.edgeColor || '#111'} 100%)` }} />
                    ) : undefined}
                    onSelect={(item) => {
                      const name = typeof item === 'string' ? item : (item.name || item)
                      if (!editingRule) return
                      if (pickerType === "GIFT") {
                        setEditingRule({ ...editingRule, giftName: name, models: [], backdrops: [] })
                        setView("EDIT")
                      } else {
                        const key = pickerType === "MODEL" ? "models" : "backdrops"
                        setEditingRule({ ...editingRule, [key]: toggleAttr(editingRule[key], name) })
                      }
                    }}
                  />
                </Box>
                {pickerType !== "GIFT" && (
                  <Box p={4} bg="#0F1115" borderTop="1px solid" borderColor="whiteAlpha.50">
                    <Button w="100%" h="48px" borderRadius="14px" bg="brand.500" color="black" fontWeight="900" onClick={() => setView("EDIT")}>ПОДТВЕРДИТЬ ВЫБОР</Button>
                  </Box>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

const CompactAttr = ({ label, count, onClick, isDisabled }: any) => (
  <Box
    bg="whiteAlpha.50" p={3} borderRadius="14px" border="1px solid"
    borderColor="whiteAlpha.50" onClick={!isDisabled ? onClick : undefined}
    cursor={isDisabled ? "not-allowed" : "pointer"}
    opacity={isDisabled ? 0.4 : 1}
    _active={!isDisabled ? { bg: "whiteAlpha.100" } : {}}
  >
    <Text fontSize="8px" color="whiteAlpha.400" fontWeight="900" mb={0.5} textTransform="uppercase">{label}</Text>
    <Text fontSize="13px" fontWeight="800" color={count > 0 ? "brand.500" : "white"}>{count > 0 ? `Выбрано: ${count}` : "Любой"}</Text>
  </Box>
)