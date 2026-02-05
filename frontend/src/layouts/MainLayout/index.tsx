// frontend/src/layouts/MainLayout/index.tsx

import React, { useEffect } from "react"
import { Box, Flex, Text, useDisclosure, IconButton, HStack } from "@chakra-ui/react"
import { useNavigate, useLocation } from "react-router-dom"
import { HOME } from "../../router/paths"
import SettingsDrawer from "../../components/overlay/SettingsDrawer"
import SnappySubscriptionDrawer from "../../components/overlay/SnappySubscriptionDrawer"
import AdBanner from "../../components/Home/AdBanner"
import { ShareIcon, SettingsIcon } from "../../components/Shared/Icons"

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const settingsDisclosure = useDisclosure()
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

      {/* ЧИСТАЯ ШАПКА */}
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={4}
        h="56px"
        bg="#0F1115"
      >
        {/* КНОПКА ПОДПИСКИ СТИЛЬ СТЕКЛА */}
        <Flex
          as="button"
          onClick={subDisclosure.onOpen}
          align="center"
          justify="center"
          minW="100px"
          h="36px"
          px={3}
          bg="rgba(255, 255, 255, 0.12)"
          borderRadius="18px"
          backdropFilter="blur(12px)"
          boxShadow="0 8px 16px rgba(0, 0, 0, 0.2)"
          transition="all 0.2s ease"
          _hover={{
            bg: "rgba(255, 255, 255, 0.15)",
            transform: "translateY(-2px)",
            boxShadow: "0 12px 20px rgba(0, 0, 0, 0.25)"
          }}
          _active={{
            transform: "translateY(0)",
            bg: "rgba(255, 255, 255, 0.1)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)"
          }}
        >
          <Flex align="center" gap={2}>
            <Box
              w="6px"
              h="6px"
              borderRadius="full"
              bg="brand.500"
              boxShadow="0 0 12px var(--chakra-colors-brand-500)"
            />
            <Text
              fontSize="12px"
              fontWeight="700"
              letterSpacing="0.2px"
              color="white"
            >
              SNAPPY<span style={{ color: "var(--chakra-colors-brand-500)", fontWeight: "800" }}>+</span>
            </Text>
          </Flex>
        </Flex>

        {/* КНОПКИ ДЕЙСТВИЙ СТИЛЬ СТЕКЛА */}
        <HStack spacing={2}>
          <IconButton
            aria-label="Share"
            icon={<ShareIcon color="white" boxSize="16px" />}
            w="36px"
            h="36px"
            minW="36px"
            bg="rgba(255, 255, 255, 0.12)"
            borderRadius="18px"
            backdropFilter="blur(12px)"
            boxShadow="0 8px 16px rgba(0, 0, 0, 0.2)"
            transition="all 0.2s ease"
            _hover={{
              bg: "rgba(255, 255, 255, 0.15)",
              transform: "translateY(-2px)",
              boxShadow: "0 12px 20px rgba(0, 0, 0, 0.25)"
            }}
            _active={{
              transform: "translateY(0)",
              bg: "rgba(255, 255, 255, 0.1)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)"
            }}
            onClick={() => WebApp?.switchInlineQuery("Check my portfolio!")}
          />

          <IconButton
            aria-label="Settings"
            icon={<SettingsIcon color="white" boxSize="16px" />}
            w="36px"
            h="36px"
            minW="36px"
            bg="rgba(255, 255, 255, 0.12)"
            borderRadius="18px"
            backdropFilter="blur(12px)"
            boxShadow="0 8px 16px rgba(0, 0, 0, 0.2)"
            transition="all 0.2s ease"
            _hover={{
              bg: "rgba(255, 255, 255, 0.15)",
              transform: "translateY(-2px)",
              boxShadow: "0 12px 20px rgba(0, 0, 0, 0.25)"
            }}
            _active={{
              transform: "translateY(0)",
              bg: "rgba(255, 255, 255, 0.1)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)"
            }}
            onClick={settingsDisclosure.onOpen}
          />
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