import React, { ReactNode, useEffect } from "react"
import { Box, Flex, Text, Image, Avatar, useDisclosure } from "@chakra-ui/react"
import { useNavigate, useLocation } from "react-router-dom"
import { HOME } from "@router/paths" // Убедитесь, что путь верный
import { WebApp } from "@grammyjs/web-app"

// Импортируем наше новое меню
import SettingsDrawer from "@components/overlay/SettingsDrawer"

import {
  WrapperStyle,
  HeaderStyle,
  HeaderLeftSection,
  HeaderRightSection,
  AvatarStyle,
  HeaderNameStyle,
  HeaderTagStyle,
  ChildrenWrapperStyle,
  // Новые стили
  HeaderActionsContainerStyle,
  OvalButtonStyle,
  SeparatorStyle,
} from "./styles"

// Иконки (можно заменить на SVG компоненты для гибкости цвета)
const ShareIcon = () => (
  <Image src="./assets/icons/share.svg" w="20px" h="20px" alt="share" filter="invert(1)" />
)
const SettingsIcon = () => (
  <Image src="./assets/icons/settings.svg" w="20px" h="20px" alt="settings" filter="invert(1)" />
)

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Хук Chakra UI для управления открытием/закрытием шторки
  const { isOpen, onOpen, onClose } = useDisclosure()

  const user = WebApp.initDataUnsafe?.user

  useEffect(() => {
    if (location.pathname !== HOME) {
      WebApp.BackButton.show()
    } else {
      WebApp.BackButton.hide()
    }
    const handleBack = () => navigate(-1)
    WebApp.BackButton.onClick(handleBack)
    return () => WebApp.BackButton.offClick(handleBack)
  }, [location, navigate])

  const handleShare = () => {
    WebApp.switchInlineQuery("Check out my NFT inventory!", ["users", "groups"])
  }

  return (
    <Flex style={WrapperStyle}>
      {/* HEADER */}
      <Box style={HeaderStyle}>
        {/* LEFT: Avatar + Name */}
        <Box style={HeaderLeftSection}>
          {user?.photo_url ? (
            <Image src={user.photo_url} alt="avatar" style={AvatarStyle} />
          ) : (
            <Avatar
              name={user?.first_name}
              size="sm"
              src={user?.photo_url}
              bg="blue.500"
              color="white"
            />
          )}
          <Flex direction="column">
            <Text style={HeaderNameStyle}>{user?.first_name || "Unknown"}</Text>
            <Text style={HeaderTagStyle}>{user?.username ? `@${user.username}` : "Collector"}</Text>
          </Flex>
        </Box>

        {/* RIGHT: Actions (OVAL) */}
        <Box style={HeaderRightSection}>
          <Flex style={HeaderActionsContainerStyle}>
            {/* Кнопка Share */}
            <Box as="button" style={OvalButtonStyle} onClick={handleShare}>
              <ShareIcon />
            </Box>

            {/* Разделитель */}
            <Box style={SeparatorStyle} />

            {/* Кнопка Settings */}
            <Box
              as="button"
              style={OvalButtonStyle}
              onClick={onOpen} // Открываем меню
            >
              <SettingsIcon />
            </Box>
          </Flex>
        </Box>
      </Box>

      {/* BODY */}
      <Box style={ChildrenWrapperStyle}>{children}</Box>

      {/* DRAWER (Меню настроек) */}
      <SettingsDrawer isOpen={isOpen} onClose={onClose} />
    </Flex>
  )
}

export default MainLayout
