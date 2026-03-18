import { ThemeProvider } from "styled-components";
import theme from "@styles/theme";
import GlobalStyle from "@styles/global";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useVh from "@hooks/useCalcVh";
import { RouterProvider } from "react-router-dom";
import router from "@routes/router";
import { UserProvider } from "@stores/UserContext";

function App() {
  useVh();

  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <RouterProvider router={router} />
      </ThemeProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
      />
    </UserProvider>
  );
}

export default App;
