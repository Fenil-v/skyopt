import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/index.ts";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import UpdateNotification from "./components/UpdateNotification.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <UpdateNotification />
        <App />
        <ToastContainer />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
