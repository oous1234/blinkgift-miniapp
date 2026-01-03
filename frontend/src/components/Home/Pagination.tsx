// frontend/src/components/Home/Pagination.tsx
import React from "react"
import { Flex, Button, Text, Box } from "@chakra-ui/react"

interface PaginationProps {
  currentPage: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
  limit?: number
  offset?: number
}

export const Pagination: React.FC<PaginationProps> = ({
                                                        currentPage,
                                                        totalCount,
                                                        pageSize,
                                                        onPageChange,
                                                        limit,
                                                        offset
                                                      }) => {
  const totalPages = Math.ceil(totalCount / pageSize)

  if (totalPages <= 1) {
    return null
  }

  return (
      <Flex
          direction="column"
          align="center"
          gap={2}
          py={4}
          borderTop="1px solid"
          borderColor="whiteAlpha.100"
      >
        {/* Можно отображать дополнительную информацию */}
        {limit && offset !== undefined && (
            <Text fontSize="xs" color="gray.500">
              Showing {offset + 1}-{Math.min(offset + limit, totalCount)} of {totalCount} items
            </Text>
        )}

        <Flex gap={2} align="center">
          <Button
              size="sm"
              variant="outline"
              colorScheme="blue"
              isDisabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>

          <Flex gap={1}>
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1

              // Показываем только ограниченное количество страниц
              if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                    <Button
                        key={pageNum}
                        size="sm"
                        variant={currentPage === pageNum ? "solid" : "outline"}
                        colorScheme="blue"
                        onClick={() => onPageChange(pageNum)}
                        minW="32px"
                        h="32px"
                        p={1}
                    >
                      {pageNum}
                    </Button>
                )
              }

              // Добавляем троеточие для пропущенных страниц
              if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return <Text key={`dots-${pageNum}`}>...</Text>
              }

              return null
            })}
          </Flex>

          <Button
              size="sm"
              variant="outline"
              colorScheme="blue"
              isDisabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </Flex>
      </Flex>
  )
}