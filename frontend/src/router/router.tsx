import { createBrowserRouter } from "react-router-dom"
import { COIN_GAME, HOME, DICE_GAME } from "./paths"
import PublicRoute from "./PublicRoute"
import HomeView from "@views/Home"
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
      ],
    },
    {
      path: "/game",
      element: (
        <MainLayout>
          <PublicRoute />
        </MainLayout>
      ),
    },
  ],
  {
    basename: "/",
  }
)

export { Router }
