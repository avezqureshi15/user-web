import theme from "@constants/theme";
import { ThemeProvider } from "@emotion/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import store from "./store";
import "./App.scss";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <Provider store={store}>
        <GoogleOAuthProvider clientId="91859588395-77ib956pud0nvkvtds7di1dkklpn16ep.apps.googleusercontent.com">
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </GoogleOAuthProvider>
      </Provider>
    </React.StrictMode>
  </ThemeProvider>,
  document.getElementById("root"),
);
