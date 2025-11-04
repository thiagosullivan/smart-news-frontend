import "./App.css";
import Header from "./components/commons/Header";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import ReceivablesPage from "./pages/Receivables";
import PayablesPage from "./pages/Payables";

function App() {
  return (
    <div className="font-inter bg-smart-news-gray-three">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recebiveis" element={<ReceivablesPage />} />
          <Route path="/pagaveis" element={<PayablesPage />} />

          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
