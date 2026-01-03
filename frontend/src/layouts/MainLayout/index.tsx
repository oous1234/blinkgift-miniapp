import React, { ReactNode, useEffect } from "react"
import { Box, Flex, Text, Avatar, useDisclosure } from "@chakra-ui/react"
import { useNavigate, useLocation } from "react-router-dom"
import { HOME } from "@router/paths"
import { WebApp } from "@grammyjs/web-app"
import SettingsDrawer from "@components/overlay/SettingsDrawer"

import {
  WrapperStyle,
  HeaderStyle,
  HeaderLeftSection,
  HeaderRightSection,
  HeaderCenterSection,
  HeaderTitleStyle,
  AvatarStyle,
  ChildrenWrapperStyle,
  HeaderActionsContainerStyle,
  OvalButtonStyle,
  SeparatorStyle,
} from "./styles"

const ShareIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
)

const SettingsIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const user = WebApp.initDataUnsafe?.user

  useEffect(() => {
    if (location.pathname !== HOME) WebApp.BackButton.show()
    else WebApp.BackButton.hide()
    const handleBack = () => navigate(-1)
    WebApp.BackButton.onClick(handleBack)
    return () => WebApp.BackButton.offClick(handleBack)
  }, [location, navigate])

  return (
    <Box style={WrapperStyle}>
      <Box style={HeaderStyle}>
        <Box style={HeaderLeftSection}>
          <Avatar
            size="sm"
            src={user?.photo_url}
            name={user?.first_name}
            style={AvatarStyle}
            bg="#1F232E"
          />
        </Box>

        <Box style={HeaderCenterSection}>
          <Text style={HeaderTitleStyle}>Wallet</Text>
        </Box>

        <Box style={HeaderRightSection}>
          <Flex style={HeaderActionsContainerStyle}>
            <Box
              as="button"
              style={OvalButtonStyle}
              onClick={() => WebApp.switchInlineQuery("Check my portfolio!")}
            >
              <ShareIcon />
            </Box>
            <Box style={SeparatorStyle} />
            <Box as="button" style={OvalButtonStyle} onClick={onOpen}>
              <SettingsIcon />
            </Box>
          </Flex>
        </Box>
      </Box>

      <Box style={ChildrenWrapperStyle}>{children}</Box>
      <SettingsDrawer isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

export default MainLayout
