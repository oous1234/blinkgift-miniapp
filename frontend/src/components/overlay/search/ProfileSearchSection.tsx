import React, { useState } from "react";
import { VStack, Input, Box, Center, Spinner, Text } from "@chakra-ui/react";
import { useSearch } from "../../../hooks/useSearch";
import { SearchResultItem } from "../../SearchResultItem";

export const ProfileSearchSection: React.FC<{ onSelect: (user: any) => void }> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const { results, isLoading, searchOwners } = useSearch();

  const handleInput = (val: string) => {
    setQuery(val);
    searchOwners(val);
  };

  return (
    <VStack align="stretch" spacing={4}>
      <Input
        placeholder="Имя или @username..."
        bg="whiteAlpha.50"
        border="none"
        borderRadius="18px"
        h="52px"
        value={query}
        onChange={(e) => handleInput(e.target.value)}
      />
      <Box mt={2}>
        {isLoading ? (
          <Center py={10}><Spinner color="brand.500" /></Center>
        ) : (
          <VStack align="stretch" spacing={3}>
            {results.map((user) => (
              <SearchResultItem key={user.id} user={user} onClick={onSelect} />
            ))}
          </VStack>
        )}
      </Box>
    </VStack>
  );
};