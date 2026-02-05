import React, { useEffect } from "react"
import { Box, Center, Spinner } from "@chakra-ui/react"
import { useSniperStore } from "../../store/useSniperStore"
import { useUIStore } from "../../store/useUIStore"
import { sniperSocketService } from "../../services/sniperSocket.service"
import { TerminalHeader } from "./components/TerminalHeader"
import { TerminalFeed } from "./components/TerminalFeed"
import { SniperFilterDrawer } from "./components/SniperFilterDrawer"

const MarketView: React.FC = () => {
  const { events, status, isLoading, initHistory, clearEvents } = useSniperStore()
  const { isSniperFiltersOpen, openSniperFilters, closeSniperFilters } = useUIStore()

  useEffect(() => {
    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || "8241853306"
    initHistory(userId)
    sniperSocketService.connect(userId)
    return () => sniperSocketService.disconnect()
  }, [])

  return (
    <Box px={4} pt={2} pb="100px">
      <TerminalHeader
        status={status}
        eventCount={events.length}
        onClear={clearEvents}
        onOpenSettings={openSniperFilters}
      />

      {isLoading ? (
        <Center h="50vh">
          <Spinner color="brand.500" thickness="3px" />
        </Center>
      ) : (
        <TerminalFeed events={events} />
      )}

      <SniperFilterDrawer
        isOpen={isSniperFiltersOpen}
        onClose={closeSniperFilters}
      />
    </Box>
  )
}

export default MarketView