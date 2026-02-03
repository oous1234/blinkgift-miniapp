import React from "react"
import { VStack, Center, Spinner, Box, Text } from "@chakra-ui/react"
import { SearchField } from "./SearchField"
import { SearchResultItem } from "@components/SearchResultItem"
import { useOwnerSearch } from "@views/Home/hooks/useOwnerSearch"

interface ProfileSearchSectionProps {
  onUserClick: (user: any) => void
  query: string
  setQuery: (val: string) => void
}

export const ProfileSearchSection: React.FC<ProfileSearchSectionProps> = ({
  onUserClick,
  query,
  setQuery
}) => {
  const { results, isLoading } = useOwnerSearch(query, "PROFILE")

  return (
    <Box>
      <SearchField
        label="Поиск по базе"
        placeholder="Введите имя или @username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <Box mt={6}>
        {isLoading ? (
          <Center py={10}>
            <Spinner color="brand.500" thickness="3px" size="lg" />
          </Center>
        ) : query.length > 0 && results.length === 0 ? (
          <Center py={10}>
            <Text color="whiteAlpha.400" fontWeight="600">Ничего не найдено</Text>
          </Center>
        ) : (
          <VStack align="stretch" spacing={3}>
            {results.map((user) => (
              <SearchResultItem
                key={user.id}
                user={user}
                onClick={onUserClick}
              />
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  )
}