// frontend/src/router/router.tsx
import { createBrowserRouter } from "react-router-dom"
import { HOME, MARKET } from "./paths"
import PublicRoute from "./PublicRoute"
import HomeView from "@views/Home"
import MarketView from "@views/Market" // Импорт нового вида
import MainLayout from "@layouts/MainLayout"

const Router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <MainLayout>
          <PublicRoute />
        </MainLayout>
      ),
      children: [
        {
          path: HOME,
          element: <HomeView />,
        },
        {
          path: "/user/:id",
          element: <HomeView />,
        },
        {
          path: MARKET,
          element: <MarketView />,
        },
      ],
    },
    {
      path: "/game",
      element: (
        <MainLayout>
          <PublicRoute />
        </MainLayout>
      ),
      children: [
        // Здесь можно добавить игровые роуты, если они понадобятся внутри лейаута
      ],
    },
  ],
  {
    basename: "/",
  }
)

export { Router }
