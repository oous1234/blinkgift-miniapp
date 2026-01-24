// frontend/src/layouts/MainLayout/index.tsx

import React, { useEffect } from "react"
import { Box, Flex, Text, Avatar, useDisclosure, IconButton, HStack } from "@chakra-ui/react"
import { useNavigate, useLocation } from "react-router-dom"
import { HOME } from "../../router/paths"
import SettingsDrawer from "../../components/overlay/SettingsDrawer"
import SnappySubscriptionDrawer from "../../components/overlay/SnappySubscriptionDrawer" // Импорт новой шторки
import AdBanner from "../../components/Home/AdBanner"
import { ShareIcon, SettingsIcon } from "../../components/Shared/Icons"

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Disclosure для настроек
  const settingsDisclosure = useDisclosure()
  // Disclosure для подписки
  const subDisclosure = useDisclosure()

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
      <AdBanner />

      {/* HEADER */}
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

        {/* НОВАЯ КНОПКА ПОДПИСКИ ВМЕСТО WALLET */}
        <Flex
          as="button"
          onClick={subDisclosure.onOpen}
          bg="whiteAlpha.100"
          px={3}
          py={1.5}
          borderRadius="full"
          justify="center"
          align="center"
          border="1px solid"
          borderColor="whiteAlpha.100"
          transition="all 0.2s"
          _active={{ transform: "scale(0.95)", bg: "whiteAlpha.200" }}
        >
          <Text fontSize="11px" fontWeight="900" color="brand.500" letterSpacing="0.5px">
            ✨ SNAPPY<Text as="span" color="white">+</Text>
          </Text>
        </Flex>

        <HStack flex={1} justify="flex-end" spacing={0}>
          <HStack bg="whiteAlpha.50" p="2px" borderRadius="14px" spacing={0}>
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
              onClick={settingsDisclosure.onOpen}
            />
          </HStack>
        </HStack>
      </Flex>

      <Box pb="100px">{children}</Box>

      {/* ОВЕРЛЕИ */}
      <SettingsDrawer isOpen={settingsDisclosure.isOpen} onClose={settingsDisclosure.onClose} />
      <SnappySubscriptionDrawer isOpen={subDisclosure.isOpen} onClose={subDisclosure.onClose} />
    </Box>
  )
}

export default MainLayout