import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "@components/layout/DefaultLayout";
import LoginLayout from "@components/layout/LoginLayout";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";
import LoginPage from "@pages/login/LoginPage";
import ServingPage from "@pages/serving/ServingPage";

const router = createBrowserRouter([
  {
    path: ROUTE_CONSTANTS.LOGIN,
    element: <LoginLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: ROUTE_CONSTANTS.HOME,
    element: <DefaultLayout />,
    children: [{ path: ROUTE_CONSTANTS.SERVING, element: <ServingPage /> }],
  },
]);

export default router;
