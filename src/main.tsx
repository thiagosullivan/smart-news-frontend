import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
// import HomePage from "./pages/Home/index.tsx";
// import ReceivablesPage from "./pages/Receivables/index.tsx";
// import PayablesPage from "./pages/Payables/index.tsx";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       {
//         index: true,
//         element: <HomePage />,
//       },
//       {
//         path: "receber",
//         element: <ReceivablesPage />,
//       },
//       {
//         path: "pagar",
//         element: <PayablesPage />,
//       },
//     ],
//   },
// ]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
