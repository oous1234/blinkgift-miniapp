import { useToast } from "@chakra-ui/react"
import { useCallback } from "react" // <--- Добавь импорт

export type ToastOptions = {
  title: string
  description?: string
  status?: "success" | "error" | "warning" | "info"
  duration?: number
  isClosable?: boolean
}

export const useCustomToast = () => {
  const toast = useToast()

  // Оборачиваем в useCallback
  const showToast = useCallback(({
                                   title,
                                   description = "",
                                   status = "info",
                                   duration = 3000,
                                   isClosable = true,
                                 }: ToastOptions) => {
    toast({
      title,
      description,
      status,
      duration,
      isClosable,
      position: "bottom",
    })
  }, [toast])

  return showToast
}