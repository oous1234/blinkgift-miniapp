import React, { useEffect } from "react"
import { Box, Flex, Text, Avatar, useDisclosure, IconButton, HStack } from "@chakra-ui/react"
import { useNavigate, useLocation } from "react-router-dom"
import { HOME } from "../../router/paths"
import SettingsDrawer from "../../components/overlay/SettingsDrawer"
import { ShareIcon, SettingsIcon } from "../../components/Shared/Icons"

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Безопасный доступ к Telegram WebApp
  const WebApp = window.Telegram?.WebApp
  const user = WebApp?.initDataUnsafe?.user

  useEffect(() => {
    if (!WebApp) return

    if (location.pathname !== HOME) {
      WebApp.BackButton.show()
    } else {
      WebApp.BackButton.hide()
    }

    const handleBack = () => navigate(-1)
    WebApp.BackButton.onClick(handleBack)
    return () => WebApp.BackButton.offClick(handleBack)
  }, [location, navigate, WebApp])

  return (
    <Box minH="100vh" bg="#0F1115" color="white">
      {/* Header */}
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={4}
        h="64px"
        position="sticky"
        top={0}
        zIndex={10}
        bg="#0F1115"
      >
        <Box flex={1}>
          <Avatar
            size="sm"
            src={user?.photo_url}
            name={user?.first_name || "User"}
            borderRadius="12px"
            bg="#1F232E"
          />
        </Box>

        <Flex bg="#e8d7fd" px={4} py={1} borderRadius="full" justify="center" align="center">
          <Text fontSize="xs" fontWeight="800" color="#0F1115" letterSpacing="0.8px">
            WALLET
          </Text>
        </Flex>

        <HStack flex={1} justify="flex-end" spacing={0}>
          <HStack bg="rgba(255, 255, 255, 0.05)" p="2px" borderRadius="14px" spacing={0}>
            <IconButton
              aria-label="Share"
              variant="ghost"
              size="sm"
              icon={<ShareIcon color="white" boxSize="18px" />}
              onClick={() => WebApp?.switchInlineQuery("Check my portfolio!")}
            />
            <Box w="1px" h="12px" bg="whiteAlpha.200" />
            <IconButton
              aria-label="Settings"
              variant="ghost"
              size="sm"
              icon={<SettingsIcon color="white" boxSize="18px" />}
              onClick={onOpen}
            />
          </HStack>
        </HStack>
      </Flex>

      <Box pb="100px">{children}</Box>

      <SettingsDrawer isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

export default MainLayout
