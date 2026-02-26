import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "@components/layout/DefaultLayout";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";
import HomePage from "@pages/home/HomePage";
import LoginPage from "@pages/login/LoginPage";
import ServingPage from "@pages/serving/ServingPage";
const router = createBrowserRouter([
  {
    path: ROUTE_CONSTANTS.HOME,
    element: <DefaultLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTE_CONSTANTS.LOGIN, element: <LoginPage /> },
      { path: ROUTE_CONSTANTS.SERVING, element: <ServingPage /> },
    ],
  },
]);

export default router;
