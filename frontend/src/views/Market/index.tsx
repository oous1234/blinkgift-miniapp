// frontend/src/views/Market/index.tsx
import React, { useEffect, useState } from "react"
import { Box, SimpleGrid, Text, Spinner, Center, Heading } from "@chakra-ui/react"
import MarketplaceService from "../../services/marketplace"
import { MarketplaceItem } from "../../types/marketplace"
import { MarketGiftCard } from "../../components/Market/MarketGiftCard"

const MarketView: React.FC = () => {
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    MarketplaceService.getShowcase().then((data) => {
      setItems(data)
      setIsLoading(false)
    })
  }, [])

  return (
    <Box pb="120px" px="16px" pt="8px">
      <Heading size="lg" mb={6} fontWeight="900" letterSpacing="-0.5px">
        Marketplace
      </Heading>

      {isLoading ? (
        <Center h="50vh">
          <Spinner color="#e8d7fd" size="xl" thickness="4px" />
        </Center>
      ) : (
        <SimpleGrid columns={2} spacing="16px">
          {items.map((item) => (
            <MarketGiftCard key={item.id} item={item} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  )
}

export default MarketView
