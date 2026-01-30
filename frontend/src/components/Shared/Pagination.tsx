import React from "react"
import { Flex, Button, Text, HStack } from "@chakra-ui/react"
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons"

interface PaginationProps {
  currentPage: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  // Защита от деления на 0 и некорректных данных
  const safePageSize = pageSize > 0 ? pageSize : 10
  const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize))

  if (totalPages <= 1) return null

  const renderPageButtons = () => {
    const pages = []
    const range = 1 // Сколько страниц показывать по бокам от текущей

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - range && i <= currentPage + range)
      ) {
        pages.push(
          <Button
            key={i}
            size="sm"
            variant={currentPage === i ? "brand" : "ghost"}
            onClick={() => onPageChange(i)}
            minW="32px"
          >
            {i}
          </Button>
        )
      } else if (i === currentPage - range - 1 || i === currentPage + range + 1) {
        pages.push(<Text key={`dots-${i}`} color="whiteAlpha.400">...</Text>)
      }
    }
    return pages
  }

  return (
    <Flex direction="column" align="center" gap={3} py={6}>
      <HStack spacing={2}>
        <Button
          size="sm"
          variant="ghost"
          isDisabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          leftIcon={<ChevronLeftIcon />}
        >
          Назад
        </Button>

        <HStack spacing={1}>
          {renderPageButtons()}
        </HStack>

        <Button
          size="sm"
          variant="ghost"
          isDisabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          rightIcon={<ChevronRightIcon />}
        >
          Далее
        </Button>
      </HStack>

      <Text fontSize="10px" fontWeight="800" color="whiteAlpha.300" textTransform="uppercase">
        Всего: {totalCount} объектов
      </Text>
    </Flex>
  )
}