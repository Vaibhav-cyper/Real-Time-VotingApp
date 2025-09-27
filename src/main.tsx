import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// importing components
import App from "./App.tsx";
import VotingPage from "./components/VotePage.tsx";
import Result from "./components/Result.tsx";
import { SocketProvider } from "@/contexts/SocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/vote" element={<VotingPage />} />
          <Route path="/results" element={<Result />} />
        </Routes>
      </Router>
    </SocketProvider>
  </StrictMode>
);
