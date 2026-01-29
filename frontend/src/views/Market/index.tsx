import React, { useEffect, useState } from "react"
import {
  Box,
  SimpleGrid,
  Spinner,
  Center,
  Heading,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react"
import MarketplaceService from "@services/marketplace"
import { MarketplaceItem } from "@types/marketplace"
import { MarketGiftCard } from "@components/Market/MarketGiftCard"
import BottomNavigation from "@components/navigation/BottomNavigation"
import SearchDrawer from "@components/overlay/search/SearchDrawer" // ИСПРАВЛЕННЫЙ ПУТЬ

const MarketView: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure()

  useEffect(() => {
    MarketplaceService.getShowcase().then((data) => {
      setItems(data)
      setIsLoading(false)
    })
  }, [])

  return (
    <Box pb="120px" px="4" pt="4">
      <VStack align="start" spacing={1} mb={6}>
        <Heading size="lg" fontWeight="900">
          Marketplace
        </Heading>
        <Text color="gray.500" fontSize="sm">
          Самые свежие предложения с рынка
        </Text>
      </VStack>

      {isLoading ? (
        <Center h="50vh">
          <Spinner color="brand.500" size="xl" thickness="4px" />
        </Center>
      ) : (
        <SimpleGrid columns={2} spacing="16px">
          {items.map((item) => (
            <MarketGiftCard key={item.id} item={item} />
          ))}
        </SimpleGrid>
      )}

      <SearchDrawer isOpen={isSearchOpen} onClose={onSearchClose} />
      <BottomNavigation onSearchOpen={onSearchOpen} />
    </Box>
  )
}

export default MarketView