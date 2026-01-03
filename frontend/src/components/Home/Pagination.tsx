// frontend/src/components/common/Pagination.tsx
import React from "react"
import { HStack, Button, Text, IconButton, Box } from "@chakra-ui/react"
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons"

interface PaginationProps {
  currentPage: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  siblingCount = 1,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize)

  if (totalPages <= 1) return null

  // Генерация массива страниц (алгоритм с троеточием)
  const generatePagination = () => {
    const range = []
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPages

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
      return [...leftRange, "DOTS", totalPages]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount
      let rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      )
      return [firstPageIndex, "DOTS", ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      )
      return [firstPageIndex, "DOTS", ...middleRange, "DOTS", lastPageIndex]
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const paginationRange = generatePagination()

  const btnStyles = {
    size: "sm",
    variant: "ghost",
    color: "gray.400",
    _hover: { bg: "whiteAlpha.100", color: "white" },
    borderRadius: "12px",
    minW: "32px",
    h: "32px",
    fontSize: "13px",
  }

  const activeBtnStyles = {
    ...btnStyles,
    bg: "blue.500",
    color: "white",
    _hover: { bg: "blue.400" },
    fontWeight: "bold",
  }

  return (
    <Box
      py={4}
      display="flex"
      justifyContent="center"
      // Glassmorphism подложка
      bg="rgba(22, 25, 32, 0.6)"
      backdropFilter="blur(10px)"
      borderTop="1px solid rgba(255,255,255,0.05)"
      position="sticky"
      bottom="76px" // Выше нижнего меню
      zIndex={90}
      mx="-16px" // Компенсация padding родителя
      px="16px"
    >
      <HStack spacing={1}>
        <IconButton
          aria-label="Previous page"
          icon={<ChevronLeftIcon />}
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          {...btnStyles}
        />

        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === "DOTS") {
            return (
              <Text key={`dots-${index}`} color="gray.600" px={1}>
                ...
              </Text>
            )
          }

          return (
            <Button
              key={pageNumber}
              onClick={() => onPageChange(Number(pageNumber))}
              {...(pageNumber === currentPage ? activeBtnStyles : btnStyles)}
            >
              {pageNumber}
            </Button>
          )
        })}

        <IconButton
          aria-label="Next page"
          icon={<ChevronRightIcon />}
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          {...btnStyles}
        />
      </HStack>
    </Box>
  )
}
