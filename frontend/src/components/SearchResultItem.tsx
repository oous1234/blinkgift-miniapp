// src/components/overlay/components/SearchResultItem.tsx
import React from "react"
import { Flex, VStack, HStack, Text, Avatar, Icon, Badge, Box } from "@chakra-ui/react"
import { UserIcon, GiftIconMini } from "../../src/components/Shared/Icons" // Используем наши иконки

interface SearchResultItemProps {
  user: any
  onClick: (user: any) => void
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({ user, onClick }) => {
  const getTypeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "channel":
        return "cyan"
      case "bot":
        return "purple"
      case "user":
        return "green"
      default:
        return "gray"
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
        name={user.name || user.username}
        size="sm"
        borderRadius="10px"
        mr="12px"
      />

      <VStack align="start" spacing="2px" flex={1} overflow="hidden">
        <HStack spacing={2}>
          <Text fontSize="14px" fontWeight="600" isTruncated maxW="150px">
            {user.name || "Unknown"}
          </Text>
          {user.telegram_type && (
            <Badge colorScheme={getTypeColor(user.telegram_type)} fontSize="9px" px={1.5}>
              {user.telegram_type}
            </Badge>
          )}
        </HStack>
        <Text fontSize="11px" color="gray.500">
          {user.username ? `@${user.username}` : `ID: ${user.telegram_id}`}
        </Text>
      </VStack>

      {user.gifts_count !== undefined && (
        <HStack bg="whiteAlpha.100" px="8px" py="4px" borderRadius="8px">
          <GiftIconMini color="#e8d7fd" />
          <Text fontSize="12px" fontWeight="700">
            {user.gifts_count}
          </Text>
        </HStack>
      )}
    </Flex>
  )
}
