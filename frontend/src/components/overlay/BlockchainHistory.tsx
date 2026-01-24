import React from "react"
import { Box, VStack, HStack, Text, Flex, Icon, Link, Spacer } from "@chakra-ui/react"
import { HistoryItem } from "../../types/explorer"

const getTonviewerUrl = (hash: string) => `https://tonviewer.com/transaction/${hash}`

// Иконка TON (алмаз)
const TonIcon = () => (
    <svg width="14" height="14" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z" fill="#0088CC"/>
        <path d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6621 19.424 14.42 22.4673L25.9814 42.4834C26.9205 44.1091 29.0791 44.1091 30.0182 42.4834L41.5807 22.4673C43.3375 19.424 41.0772 15.6277 37.5603 15.6277ZM26.043 35.5398L19.5447 24.2882C18.8471 23.08 19.7188 21.5544 21.1127 21.5544H34.8851C36.279 21.5544 37.1507 23.08 36.4531 24.2882L29.9548 35.5398C29.0638 37.0833 26.8797 37.0833 26.043 35.5398Z" fill="white"/>
    </svg>
)

// Сокращение адреса
const ShortAddr = ({ addr }: { addr?: string | null }) => {
    if (!addr) return <Text as="span" color="whiteAlpha.400">—</Text>
    return (
        <Text as="span" color="blue.300" fontWeight="700" fontSize="13px">
            {addr.startsWith("EQ") || addr.startsWith("UQ")
                ? `${addr.slice(0, 4)}...${addr.slice(-4)}`
                : addr}
        </Text>
    )
}

// Иконки в стиле GetGems
const GetGemsIcons = {
    transfer: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M17 10L21 6L17 2M7 14L3 18L7 22" stroke="#00F2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 6H9C7.14348 6 5.36301 6.7375 4.05025 8.05025C2.7375 9.36301 2 11.1435 2 13V15M3 18H15C16.8565 18 18.637 17.2625 19.9497 15.9497C21.2625 14.637 22 12.8565 22 11V9" stroke="#00F2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
        </svg>
    ),
    mint: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M13.5 6L10 18.5M16 8.5L14.5 14M9 10L7.5 15.5M5 20H19" stroke="#FF00FF" strokeWidth="2" strokeLinecap="round"/>
            <path d="M15 3L18.5 6.5L13.5 11.5L10 8L15 3Z" stroke="#FF00FF" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
    ),
    putUpForSale: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#4CD964" strokeWidth="2"/>
            <path d="M12 8V16M8 12H16" stroke="#4CD964" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    ),
    cancelSale: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#FF3B30" strokeWidth="2"/>
            <path d="M15 9L9 15M9 9L15 15" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    ),
    sale: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="#0088CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 6H21M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="#0088CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

const getEventData = (type: string) => {
    switch (type) {
        case "mint": return { label: "Минт", icon: GetGemsIcons.mint }
        case "transfer": return { label: "Передача", icon: GetGemsIcons.transfer }
        case "putUpForSale": return { label: "Выставление", icon: GetGemsIcons.putUpForSale }
        case "cancelSale": return { label: "Отмена", icon: GetGemsIcons.cancelSale }
        case "sale": return { label: "Продажа", icon: GetGemsIcons.sale }
        default: return { label: type.toUpperCase(), icon: GetGemsIcons.transfer }
    }
}

export const BlockchainHistory: React.FC<{ history: HistoryItem[] }> = ({ history }) => {
    return (
        <VStack align="stretch" spacing={3} py={2}>
            {history.map((item) => {
                const event = getEventData(item.typeData.type)
                return (
                    <Link
                        key={item.hash}
                        href={getTonviewerUrl(item.hash)}
                        isExternal
                        _hover={{ textDecoration: "none" }}
                    >
                        <Box
                            bg="whiteAlpha.50"
                            borderRadius="22px"
                            p={4}
                            transition="all 0.15s ease-in-out"
                            border="1px solid"
                            borderColor="whiteAlpha.50"
                            _active={{ transform: "scale(0.97)", bg: "whiteAlpha.100" }}
                        >
                            <HStack spacing={4} align="center">
                                {/* Иконка события */}
                                <Flex
                                    w="48px"
                                    h="48px"
                                    bg="rgba(0,0,0,0.3)"
                                    borderRadius="16px"
                                    align="center"
                                    justify="center"
                                    flexShrink={0}
                                >
                                    {event.icon}
                                </Flex>

                                {/* Основная инфа */}
                                <VStack align="start" spacing={0} flex={1}>
                                    <Text fontWeight="800" fontSize="16px" color="white" lineHeight="1.2">
                                        {event.label}
                                    </Text>
                                    <Text fontSize="11px" color="gray.500" fontWeight="600">
                                        {new Date(item.time).toLocaleDateString("ru-RU", {
                                            day: "numeric",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </Text>
                                </VStack>

                                <Spacer />

                                {/* Правый блок: Цена с иконкой или Адрес */}
                                <Box alignSelf="center">
                                    {item.typeData.price ? (
                                        <HStack
                                            bg="brand.500"
                                            px={3}
                                            py={1.5}
                                            borderRadius="12px"
                                            spacing={1.5}
                                            boxShadow="0 4px 12px rgba(232, 215, 253, 0.2)"
                                        >
                                            <Text fontWeight="900" fontSize="14px" color="gray.900">
                                                {item.typeData.price}
                                            </Text>
                                            <TonIcon />
                                        </HStack>
                                    ) : item.typeData.type === "transfer" ? (
                                        <VStack align="end" spacing={0}>
                                            <Text fontSize="9px" color="gray.600" fontWeight="900" letterSpacing="0.5px">КОМУ</Text>
                                            <ShortAddr addr={item.typeData.newOwner} />
                                        </VStack>
                                    ) : (
                                        <Icon as={() => (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.2">
                                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                                            </svg>
                                        )} />
                                    )}
                                </Box>
                            </HStack>
                        </Box>
                    </Link>
                )
            })}
        </VStack>
    )
}