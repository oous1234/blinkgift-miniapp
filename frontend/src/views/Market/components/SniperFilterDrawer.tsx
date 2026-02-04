import React, { useState, useEffect } from "react"
import {
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  VStack, HStack, Text, Box, Button, Divider, IconButton
} from "@chakra-ui/react"
import { ChevronRightIcon, DeleteIcon } from "@chakra-ui/icons"
import { AttributePicker } from "@components/overlay/search/AttributePicker"
import ChangesService from "@services/changes"
import { SniperFilters } from "../hooks/useSniperLogic"

interface SniperFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  activeFilters: SniperFilters
  onApply: (filters: SniperFilters) => void
}

export const SniperFilterDrawer: React.FC<SniperFilterDrawerProps> = ({
  isOpen, onClose, activeFilters, onApply
}) => {
  const [tempFilters, setTempFilters] = useState<SniperFilters>(activeFilters)
  const [pickerMode, setPickerMode] = useState<"NONE" | "MODEL" | "BACKDROP">("NONE")
  const [allGifts, setAllGifts] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      setTempFilters(activeFilters)
      ChangesService.getGifts().then(setAllGifts)
    }
  }, [isOpen, activeFilters])

  const handleToggle = (type: keyof SniperFilters, value: string) => {
    const current = tempFilters[type] || []
    const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value]
    setTempFilters({ ...tempFilters, [type]: next })
  }

  if (pickerMode !== "NONE") {
    return (
      <Drawer isOpen={isOpen} placement="bottom" onClose={() => setPickerMode("NONE")}>
        <DrawerContent bg="#0F1115" borderTopRadius="30px" h="85vh">
          <AttributePicker
            title={pickerMode === "MODEL" ? "Выбор Модели" : "Выбор Фона"}
            items={allGifts}
            onBack={() => setPickerMode("NONE")}
            onSelect={(val) => {
              const key = pickerMode === "MODEL" ? "models" : "backdrops"
              handleToggle(key, val)
              setPickerMode("NONE")
            }}
          />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay backdropFilter="blur(10px)" bg="blackAlpha.700" />
      <DrawerContent bg="#0F1115" borderTopRadius="32px">
        <Box w="40px" h="5px" bg="whiteAlpha.300" borderRadius="full" mx="auto" mt={4} />
        <DrawerHeader>
          <HStack justify="space-between" pr={4}>
            <VStack align="start" spacing={0}>
              <Text fontSize="20px" fontWeight="900">Sniper Settings</Text>
              <Text fontSize="12px" color="whiteAlpha.500">Уведомления о находках</Text>
            </VStack>
            <IconButton
                aria-label="Reset" icon={<DeleteIcon />} variant="ghost" color="red.400"
                onClick={() => setTempFilters({ models: [], backdrops: [] })}
            />
          </HStack>
        </DrawerHeader>
        <DrawerCloseButton mt={2} />
        <DrawerBody pb={10} px={6}>
          <VStack spacing={4} align="stretch">
            <SelectorRow
                label="Модели"
                count={tempFilters.models?.length || 0}
                onClick={() => setPickerMode("MODEL")}
            />
            <SelectorRow
                label="Фоны"
                count={tempFilters.backdrops?.length || 0}
                onClick={() => setPickerMode("BACKDROP")}
            />

            <Box py={2}><Divider borderColor="whiteAlpha.100" /></Box>

            <Button
              h="60px" bg="brand.500" color="black" borderRadius="20px" fontWeight="900" fontSize="16px"
              _active={{ transform: "scale(0.96)" }}
              onClick={() => { onApply(tempFilters); onClose(); }}
            >
              ОБНОВИТЬ ПОДПИСКУ
            </Button>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

const SelectorRow = ({ label, count, onClick }: any) => (
  <HStack
    bg="whiteAlpha.50" p={4} borderRadius="20px" justify="space-between" cursor="pointer"
    onClick={onClick} border="1px solid" borderColor="whiteAlpha.100" _active={{ bg: "whiteAlpha.100" }}
  >
    <VStack align="start" spacing={0}>
      <Text fontSize="14px" fontWeight="800">{label}</Text>
      <Text fontSize="11px" color="brand.500" fontWeight="700">
        {count > 0 ? `Выбрано: ${count}` : "Любые"}
      </Text>
    </VStack>
    <ChevronRightIcon color="whiteAlpha.300" boxSize={6} />
  </HStack>
)