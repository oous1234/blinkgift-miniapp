// frontend/src/router/router.tsx
import { createBrowserRouter } from "react-router-dom"
import { HOME, MARKET, TRADE } from "./paths"
import PublicRoute from "./PublicRoute"
import HomeView from "@views/Home"
import TradeView from "@views/Trade"
import MarketView from "@views/Market"
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
          path: TRADE,
          element: <TradeView />,
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
      ],
    },
  ],
  {
    basename: "/",
  }
)

export { Router }
