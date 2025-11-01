import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import App from "./App.jsx";
if (typeof window !== "undefined" && typeof window.Info === "undefined") {
  window.Info = {};
}

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
