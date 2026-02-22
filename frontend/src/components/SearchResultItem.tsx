import React from "react"
import { Flex, VStack, HStack, Text, Avatar, Badge, Box } from "@chakra-ui/react"
import { GiftIconMini } from "./Shared/Icons"
import { SearchOwnerResult } from "../services/owner.service"

interface SearchResultItemProps {
  user: SearchOwnerResult
  onClick: (user: SearchOwnerResult) => void
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({ user, onClick }) => {
  const getTypeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "channel": return "cyan";
      case "bot": return "purple";
      case "user": return "green";
      default: return "gray";
    }
  }

  return (
    <Flex
      onClick={() => onClick(user)}
      align="center"
      p="12px"
      bg="whiteAlpha.50"
      borderRadius="16px"
      cursor="pointer"
      transition="0.2s"
      _active={{ bg: "whiteAlpha.200", transform: "scale(0.98)" }}
    >
      <Avatar
        src={user.username ? `https://poso.see.tg/api/avatar/${user.username}` : undefined}
        name={user.title}
        size="sm"
        borderRadius="10px"
        mr="12px"
      />
      <VStack align="start" spacing="2px" flex={1} overflow="hidden">
        <HStack spacing={2}>
          <Text fontSize="14px" fontWeight="800" isTruncated maxW="150px" color="white">
            {user.title}
          </Text>
          {user.verified && (
            <Box boxSize="14px" bg="blue.400" borderRadius="full" display="flex" alignItems="center" justify="center">
                <Text fontSize="8px" color="white">✓</Text>
            </Box>
          )}
          <Badge colorScheme={getTypeColor(user.type)} fontSize="9px" px={1.5} borderRadius="4px">
            {user.type}
          </Badge>
        </HStack>
        <Text fontSize="11px" color="whiteAlpha.400" fontWeight="600">
          {user.username ? `@${user.username}` : `ID: ${user.id}`}
        </Text>
      </VStack>

      {user.nft_count > 0 && (
        <HStack bg="brand.500" px="8px" py="4px" borderRadius="10px" spacing={1.5}>
          <GiftIconMini boxSize="12px" color="black" />
          <Text fontSize="12px" fontWeight="900" color="black">
            {user.nft_count}
          </Text>
        </HStack>
      )}
    </Flex>
  )
}