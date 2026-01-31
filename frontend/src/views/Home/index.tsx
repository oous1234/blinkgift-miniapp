import React, { useState } from "react"
import {
  Box,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Heading,
  Flex,
  Avatar,
  Divider,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Scrollbar,
} from "@chakra-ui/react"
import { SearchIcon, InfoOutlineIcon, TriangleUpIcon } from "@chakra-ui/icons"
import { useHomeLogic } from "./hooks/useHomeLogic"
import { GiftCard } from "@components/Home/GiftCard"
import { Pagination } from "@components/Home/Pagination"
import BottomNavigation from "@components/navigation/BottomNavigation"
import GiftDetailDrawer from "@components/overlay/GiftDetailDrawer"
import SearchDrawer from "@components/overlay/search/SearchDrawer"
import { TonIconBlue, NftIcon } from "@components/Shared/Icons"

const ProfilePage: React.FC = () => {
  const logic = useHomeLogic()
  const [activeFilter, setActiveFilter] = useState("all")

  return (
    <Box minH="100vh" bg="#0F1115" px={4} pt={4} pb="120px">

      {/* HEADER SECTION: Аватар слева, инфо справа через разделители */}
      <Flex align="center" mb={8} mt={2}>
        <Avatar
          size="xl"
          src={window.Telegram?.WebApp?.initDataUnsafe?.user?.photo_url}
          name="User"
          borderRadius="24px"
          mr={5}
          border="1px solid"
          borderColor="whiteAlpha.200"
        />

        <VStack align="start" spacing={1} flex={1}>
          <HStack spacing={2} divider={<Box w="1px" h="10px" bg="whiteAlpha.300" />}>
            <Text color="whiteAlpha.400" fontSize="10px" fontWeight="900" textTransform="uppercase">
              Portfolio
            </Text>
            <Text color="brand.500" fontSize="10px" fontWeight="900" textTransform="uppercase">
              Whale Status
            </Text>
          </HStack>

          <HStack spacing={2} align="baseline">
            <Text fontSize="32px" fontWeight="900" lineHeight="1">
              {logic.analytics.current.toFixed(2)}
            </Text>
            <TonIconBlue boxSize="18px" />
          </HStack>

          <HStack spacing={3} divider={<Box w="1px" h="12px" bg="whiteAlpha.200" />}>
            <HStack spacing={1}>
              <Text fontSize="13px" fontWeight="800" color="#4CD964">
                +{logic.analytics.percent.toFixed(1)}%
              </Text>
            </HStack>
            <Text fontSize="13px" fontWeight="800" color="whiteAlpha.700">
              {logic.totalCount} items
            </Text>
            <Text fontSize="13px" fontWeight="800" color="whiteAlpha.700">
                ≈ ${(logic.analytics.current * 5.4).toFixed(0)}
            </Text>
          </HStack>
        </VStack>
      </Flex>

      {/* НОВЫЙ БЛОК: СРЕДНИЙ СЛОЙ (Умные инсайты) */}
      <VStack align="stretch" spacing={4} mb={8}>
        <Text fontSize="10px" fontWeight="900" color="whiteAlpha.300" letterSpacing="1px" textTransform="uppercase">
          Market Intelligence
        </Text>

        <SimpleGrid columns={2} spacing={3}>
            {/* Блок 1: Топ ассет по росту */}
            <Box bg="whiteAlpha.50" p={3} borderRadius="18px" border="1px solid" borderColor="whiteAlpha.100">
                <Text fontSize="9px" color="whiteAlpha.400" fontWeight="800" mb={1}>TOP GAINER</Text>
                <HStack justify="space-between">
                    <Text fontSize="12px" fontWeight="800" isTruncated>Candy Cane</Text>
                    <Text fontSize="11px" fontWeight="900" color="#4CD964">+12%</Text>
                </HStack>
            </Box>

            {/* Блок 2: Ликвидность (NFT vs Off-chain) */}
            <Box bg="whiteAlpha.50" p={3} borderRadius="18px" border="1px solid" borderColor="whiteAlpha.100">
                <Text fontSize="9px" color="whiteAlpha.400" fontWeight="800" mb={1}>LIQUIDITY</Text>
                <HStack spacing={1} w="100%">
                    <Box h="4px" flex={3} bg="brand.500" borderRadius="full" />
                    <Box h="4px" flex={1} bg="whiteAlpha.300" borderRadius="full" />
                </HStack>
                <Text fontSize="10px" fontWeight="700" mt={1} color="whiteAlpha.600">75% On-chain</Text>
            </Box>
        </SimpleGrid>

        {/* Скролл-лента быстрых действий или алертов */}
        <Flex gap={3} overflowX="auto" pb={2} sx={{ '::-webkit-scrollbar': { display: 'none' } }}>
            <HStack bg="brand.500" color="black" px={3} py={2} borderRadius="12px" flexShrink={0} cursor="pointer">
                <Icon as={TriangleUpIcon} boxSize="10px" />
                <Text fontSize="11px" fontWeight="900">ПОДБОРКА ДЛЯ ПЕРЕПРОДАЖИ</Text>
            </HStack>
            <HStack bg="whiteAlpha.100" px={3} py={2} borderRadius="12px" flexShrink={0}>
                <Icon as={InfoOutlineIcon} boxSize="12px" color="brand.500" />
                <Text fontSize="11px" fontWeight="800">PREMARKET: +5.4% за сутки</Text>
            </HStack>
        </Flex>
      </VStack>

      {/* ИНВЕНТАРЬ И ФИЛЬТРЫ */}
      <Box mb={4}>
        <Flex justify="space-between" align="center" mb={4}>
            <Heading size="sm" fontWeight="900" letterSpacing="-0.5px">INVENTORY</Heading>
            <HStack spacing={4}>
                <Text
                    fontSize="11px"
                    fontWeight="900"
                    color={activeFilter === 'all' ? "brand.500" : "whiteAlpha.400"}
                    onClick={() => setActiveFilter('all')}
                    cursor="pointer"
                >ALL</Text>
                <Text
                    fontSize="11px"
                    fontWeight="900"
                    color={activeFilter === 'nft' ? "brand.500" : "whiteAlpha.400"}
                    onClick={() => setActiveFilter('nft')}
                    cursor="pointer"
                >NFT</Text>
            </HStack>
        </Flex>

        <InputGroup mb={6}>
            <InputLeftElement pointerEvents="none">
                <SearchIcon color="whiteAlpha.300" boxSize="12px" />
            </InputLeftElement>
            <Input
                placeholder="Search by ID or name..."
                variant="unstyled"
                bg="whiteAlpha.50"
                h="44px"
                pl="40px"
                borderRadius="14px"
                fontSize="13px"
                _placeholder={{ color: "whiteAlpha.300" }}
            />
        </InputGroup>

        <SimpleGrid columns={2} spacing={3}>
          {logic.items.map((item) => (
            <GiftCard key={item.id} item={item} onClick={logic.handleGiftClick} />
          ))}
        </SimpleGrid>
      </Box>

      <Pagination
        currentPage={logic.currentPage}
        totalCount={logic.totalCount}
        pageSize={logic.limit}
        onPageChange={logic.setPage}
      />

      {/* Drawers */}
      <GiftDetailDrawer
        isOpen={logic.detailDisclosure.isOpen}
        onClose={logic.detailDisclosure.onClose}
        gift={logic.selectedGift}
        isLoading={logic.isDetailLoading}
        isError={logic.isDetailError}
      />
      <SearchDrawer
        isOpen={logic.searchDisclosure.isOpen}
        onClose={logic.searchDisclosure.onClose}
      />
      <BottomNavigation onSearchOpen={logic.searchDisclosure.onOpen} />
    </Box>
  )
}

export default ProfilePage