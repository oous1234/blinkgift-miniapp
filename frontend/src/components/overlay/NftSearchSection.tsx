import React, { useState } from "react"
import { VStack, SimpleGrid, Button, useDisclosure, Box, Text } from "@chakra-ui/react"
import { SearchField } from "./SearchField"
import { GiftPickerDrawer } from "./GiftPickerDrawer" // Наш новый компонент
import { NftIcon } from "../Shared/Icons"

export const NftSearchSection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [form, setForm] = useState({
    gift: "Все подарки",
    model: "",
    backdrop: "Все фоны",
    pattern: "Все узоры",
    number: ""
  })

  return (
    <VStack spacing={5} align="stretch">
      {/* ... (Ваша иконка NFT в центре) */}

      <SimpleGrid columns={2} spacing={3}>
        <Box onClick={onOpen} cursor="pointer">
          <SearchField
            label="Подарок"
            isMenu
            readOnly // Чтобы нельзя было печатать вручную в главном поле
          >
            <Box p="12px" fontSize="14px" fontWeight="700">
              {form.gift}
            </Box>
          </SearchField>
        </Box>

        <SearchField
          label="Модель"
          placeholder="Pepe..."
          value={form.model}
          onChange={(e) => setForm({...form, model: e.target.value})}
        />

        {/* ... остальные поля */}
      </SimpleGrid>

      <Button h="54px" bg="white" color="black" borderRadius="18px" fontWeight="900" mt={2}>
        Найти NFT
      </Button>

      {/* Сам Drawer выбора */}
      <GiftPickerDrawer
        isOpen={isOpen}
        onClose={onClose}
        onSelect={(giftName) => setForm({...form, gift: giftName})}
      />
    </VStack>
  )
}