import React from "react"
import { Box, Flex, Icon } from "@chakra-ui/react"
import { useNavigate, useLocation } from "react-router-dom"
import { haptic } from "../../helpers/haptic"
import { UserIcon, MarketIcon, TradeIcon, SearchIconSolid } from "../Shared/Icons"

interface Props {
  onSearchOpen: () => void
}

const BottomNavigation: React.FC<Props> = ({ onSearchOpen }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { id: 'home', path: '/', icon: UserIcon },
    { id: 'market', path: '/market', icon: MarketIcon },
    { id: 'trade', path: '/trade', icon: TradeIcon },
    { id: 'search', action: onSearchOpen, icon: SearchIconSolid },
  ]

  const handleTabClick = (tab: any) => {
    haptic.selection()
    if (tab.action) {
      tab.action()
    } else {
      navigate(tab.path)
    }
  }

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex={1000}
      bg="rgba(15, 17, 21, 0.85)"
      backdropFilter="blur(20px)"
      borderTop="1px solid"
      borderColor="whiteAlpha.100"
      pb="env(safe-area-inset-bottom)"
    >
      <Flex h="65px" align="center" justify="space-around">
        {tabs.map((tab) => {
          const isActive = tab.path ? location.pathname === tab.path : false
          return (
            <Flex
              key={tab.id}
              flex={1}
              align="center"
              justify="center"
              onClick={() => handleTabClick(tab)}
              cursor="pointer"
              color={isActive ? "white" : "whiteAlpha.400"}
              transition="all 0.2s"
            >
              <Icon as={tab.icon} boxSize="24px" />
            </Flex>
          )
        })}
      </Flex>
    </Box>
  )
}

export default BottomNavigation