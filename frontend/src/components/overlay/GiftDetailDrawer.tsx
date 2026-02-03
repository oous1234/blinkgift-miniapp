import React from "react"
import {
  Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerCloseButton, Box,
} from "@chakra-ui/react"
import { GiftItem } from "../../types/inventory"
import { GiftDetailContent } from "./GiftDetailContent"

interface GiftDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  gift: GiftItem | null
  isLoading: boolean
  isError: boolean
}

const GiftDetailDrawer: React.FC<GiftDetailDrawerProps> = ({
  isOpen, onClose, gift, isLoading, isError,
}) => {
  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose} scrollBehavior="inside">
      <DrawerOverlay backdropFilter="blur(20px)" bg="blackAlpha.800" />
      <DrawerContent borderTopRadius="36px" bg="#0F1115" color="white" maxH="92vh">
        <Box w="40px" h="5px" bg="whiteAlpha.200" borderRadius="full" mx="auto" mt={4} mb={2} />
        <DrawerCloseButton top={6} right={6} color="whiteAlpha.400" />
        <DrawerBody px={6} pt={2} pb={10}>
          <GiftDetailContent
            gift={gift}
            isLoading={isLoading}
            isError={isError}
            // В Drawer кнопка "Назад" не нужна, так как есть крестик и смахивание
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default GiftDetailDrawer