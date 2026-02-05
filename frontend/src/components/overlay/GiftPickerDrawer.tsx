import React, { useState, useEffect, useMemo } from "react"
import {
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  VStack, HStack, Image, Text, Box, Spinner, Center, Input, InputGroup, InputLeftElement
} from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons"
import { ChangesService } from "../../services/changes.service"

interface GiftPickerDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (giftName: string) => void
}

export const GiftPickerDrawer: React.FC<GiftPickerDrawerProps> = ({ isOpen, onClose, onSelect }) => {
  const [allGifts, setAllGifts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [visibleCount, setVisibleCount] = useState(10) // Сколько отображаем сейчас

  useEffect(() => {
    if (isOpen) {
      ChangesService.getGifts().then((data) => {
        setAllGifts(data)
        setIsLoading(false)
      })
    }
  }, [isOpen])

  // Фильтрация по поиску
  const filteredGifts = useMemo(() => {
    return allGifts.filter(g => g.toLowerCase().includes(search.toLowerCase()))
  }, [allGifts, search])

  // Список для рендера (обрезанный по пагинации)
  const visibleGifts = filteredGifts.slice(0, visibleCount)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    // Если до конца осталось менее 50px
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      if (visibleCount < filteredGifts.length) {
        setVisibleCount(prev => prev + 10) // Добавляем еще 10
      }
    }
  }

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} scrollBehavior="inside">
      <DrawerOverlay backdropFilter="blur(10px)" />
      <DrawerContent bg="#1F232E" borderTopRadius="24px" maxH="70vh">
        <DrawerHeader borderBottomWidth="0px">
          <Text fontSize="18px" fontWeight="900" textAlign="center">Выберите подарок</Text>
          <InputGroup mt={4}>
            <InputLeftElement pointerEvents="none"><SearchIcon color="gray.500" /></InputLeftElement>
            <Input
              placeholder="Поиск подарка..."
              bg="whiteAlpha.50"
              border="none"
              borderRadius="12px"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setVisibleCount(10) // Сбрасываем пагинацию при поиске
              }}
            />
          </InputGroup>
        </DrawerHeader>
        <DrawerCloseButton />

        <DrawerBody onScroll={handleScroll} pb={10}>
          {isLoading ? (
            <Center py={10}><Spinner color="brand.500" /></Center>
          ) : (
            <VStack align="stretch" spacing={2}>
              {visibleGifts.map((gift) => (
                <HStack
                  key={gift}
                  p={3}
                  bg="whiteAlpha.50"
                  borderRadius="16px"
                  cursor="pointer"
                  _active={{ bg: "whiteAlpha.200", transform: "scale(0.98)" }}
                  onClick={() => {
                    onSelect(gift)
                    onClose()
                  }}
                >
                  <Box bg="whiteAlpha.100" p={1} borderRadius="10px">
                    <Image
                      src={ChangesService.getOriginalImage(gift)}
                      boxSize="40px"
                      fallback={<Box boxSize="40px" />}
                    />
                  </Box>
                  <Text fontWeight="800" fontSize="15px">{gift}</Text>
                </HStack>
              ))}

              {visibleCount < filteredGifts.length && (
                <Center py={4}>
                  <Spinner size="sm" color="gray.500" />
                </Center>
              )}
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}