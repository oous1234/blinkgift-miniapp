import React from "react"
import { VStack, Center, Spinner, Box } from "@chakra-ui/react"
import { SearchField } from "./SearchField"
import { SearchResultItem } from "@components/SearchResultItem"
import { useOwnerSearch } from "@views/Home/hooks/useOwnerSearch"

interface Props {
  query: string
  setQuery: (val: string) => void
  onUserClick: (user: any) => void // Пропс называется так
}

export const ProfileSearchSection: React.FC<Props> = ({ query, setQuery, onUserClick }) => {
  const { results, isLoading } = useOwnerSearch(query, "PROFILE")

  return (
    <Box>
      <SearchField
        label="Имя или Username"
        placeholder="Введите имя или username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Box mt={4}>
        {isLoading ? (
          <Center py={10}>
            <Spinner color="brand.500" />
          </Center>
        ) : (
          <VStack align="stretch" spacing={2}>
            {results.map((user) => (
              <SearchResultItem
                key={user.id}
                user={user}
                onClick={onUserClick} // ИСПРАВЛЕНО: было handleUserClick
              />
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  )
}