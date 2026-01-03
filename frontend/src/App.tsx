import { RouterProvider } from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react"
import { Router } from "@router/router"
import { TelegramContextProvider } from "@contexts/telegramContext"
import { customTheme } from "./customTheme"
import MainLayout from "./components/MainLayout"

const App: React.FC = () => {
  return (
    <TelegramContextProvider>
      <ChakraProvider resetCSS theme={customTheme}>
        <RouterProvider router={Router} />
        <MainLayout/>
      </ChakraProvider>
    </TelegramContextProvider>
  )
}

export default App
