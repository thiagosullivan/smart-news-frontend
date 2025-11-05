import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import CoreProvider from "./utils/core-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CoreProvider>
      <BrowserRouter basename="/smart-news-frontend">
        <App />
      </BrowserRouter>
    </CoreProvider>
  </StrictMode>
);
