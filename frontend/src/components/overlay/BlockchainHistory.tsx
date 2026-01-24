import React from "react"
import { Box, VStack, HStack, Text, Circle, Flex, Icon } from "@chakra-ui/react"
import { HistoryItem } from "../../types/explorer"
import { ChevronDownIcon } from "@chakra-ui/icons"

const ShortAddr = ({ addr }: { addr?: string | null }) => {
    if (!addr) return <Text as="span" color="gray.600">N/A</Text>
    return (
        <Text as="span" color="brand.500" fontWeight="700" fontSize="13px">
            {`${addr.slice(0, 4)}...${addr.slice(-4)}`}
        </Text>
    )
}

const EventIcon = ({ type }: { type: string }) => {
    const configs: any = {
        mint: { bg: "#E8D7FD", text: "✨", color: "#0F1115" },
        transfer: { bg: "#2D3748", text: "↔️", color: "white" },
        putUpForSale: { bg: "#2B6CB0", text: "🏷️", color: "white" },
        cancelSale: { bg: "#C53030", text: "✖️", color: "white" },
        sale: { bg: "#38A169", text: "💰", color: "white" },
    }
    const config = configs[type] || { bg: "gray.500", text: "•", color: "white" }

    return (
        <Circle size="36px" bg={config.bg} color={config.color} fontSize="16px" zIndex={2} boxShadow="0 0 15px rgba(0,0,0,0.2)">
            {config.text}
        </Circle>
    )
}

export const BlockchainHistory: React.FC<{ history: HistoryItem[] }> = ({ history }) => {
    return (
        <Box position="relative" py={2} px={1}>
            {/* Линия таймлайна */}
            <Box
                position="absolute"
                left="18px"
                top="20px"
                bottom="20px"
                w="2px"
                bgGradient="linear(to-b, brand.500, whiteAlpha.100)"
                zIndex={1}
            />

            <VStack align="stretch" spacing={0}>
                {history.map((item, index) => (
                    <Box key={item.hash}>
                        <HStack align="flex-start" spacing={4} mb={2}>
                            <EventIcon type={item.typeData.type} />

                            <VStack align="start" spacing={1} flex={1} pt={1}>
                                <HStack justify="space-between" w="100%">
                                    <Text fontWeight="900" fontSize="14px" letterSpacing="0.5px" color="white">
                                        {item.typeData.type === "putUpForSale" ? "LISTING" :
                                            item.typeData.type === "cancelSale" ? "CANCEL SALE" :
                                                item.typeData.type === "transfer" ? "TRANSFER" :
                                                    item.typeData.type === "mint" ? "MINT" : item.typeData.type.toUpperCase()}
                                    </Text>
                                    <Text fontSize="10px" fontWeight="700" color="gray.500">
                                        {new Date(item.time).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </HStack>

                                <Box
                                    bg="whiteAlpha.50"
                                    p={3}
                                    borderRadius="16px"
                                    w="100%"
                                    border="1px solid"
                                    borderColor="whiteAlpha.100"
                                >
                                    {item.typeData.type === "transfer" && (
                                        <Text fontSize="12px" color="gray.300">
                                            From <ShortAddr addr={item.typeData.oldOwner} /> to <ShortAddr addr={item.typeData.newOwner} />
                                        </Text>
                                    )}
                                    {(item.typeData.type === "putUpForSale" || item.typeData.type === "cancelSale") && (
                                        <HStack justify="space-between">
                                            <Text fontSize="12px" color="gray.400">Price:</Text>
                                            <Text fontWeight="900" color="brand.500" fontSize="14px">
                                                {item.typeData.price} {item.typeData.currency || "TON"}
                                            </Text>
                                        </HStack>
                                    )}
                                    {item.typeData.type === "mint" && (
                                        <Text fontSize="12px" color="gray.400">Первичная чеканка подарка в блокчейне</Text>
                                    )}
                                </Box>
                            </VStack>
                        </HStack>

                        {/* Стрелочка между элементами */}
                        {index !== history.length - 1 && (
                            <Flex w="36px" justify="center" my={2}>
                                <Icon as={ChevronDownIcon} color="brand.500" boxSize={5} opacity={0.5} />
                            </Flex>
                        )}
                    </Box>
                ))}
            </VStack>
        </Box>
    )
}