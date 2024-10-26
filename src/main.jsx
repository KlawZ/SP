import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { StateProvider } from "./context/StateContext";
import "bootstrap/dist/css/bootstrap.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StateProvider>
      <App />
    </StateProvider>
  </StrictMode>
);
