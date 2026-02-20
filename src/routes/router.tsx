import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "@components/layout/DefaultLayout";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";
import HomePage from "@pages/home/HomePage";
import LoginPage from "@pages/login/LoginPage";
const router = createBrowserRouter([
  {
    path: ROUTE_CONSTANTS.HOME,
    element: <DefaultLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTE_CONSTANTS.LOGIN, element: <LoginPage /> },
    ],
  },
]);

export default router;
