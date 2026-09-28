import { ROUTES } from "../shared/model/routes";
import { createBrowserRouter } from "react-router";
import { App } from "./app";
import { ProtectedRoute } from "./protected-route";
import { protectedLoader } from "./protected-loader";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        loader: protectedLoader,
        element: (
          <>
            <ProtectedRoute />
          </>
        ),
        children: [
          {
            path: ROUTES.HOME,
            lazy: () => import("@/features/main/main.page"),
          },
        ],
      },
      {
        path: ROUTES.LOGIN,
        lazy: () => import("@/features/auth/login.page"),
      },
    ],
  },
]);
