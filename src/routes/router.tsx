import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "@components/layout/DefaultLayout";
import { ROUTE_CONSTANTS } from "@constants/RouteConstants";
import HomePage from "@pages/home/HomePage";

const router = createBrowserRouter([
  {
    path: ROUTE_CONSTANTS.HOME,
    element: <DefaultLayout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
]);

export default router;
