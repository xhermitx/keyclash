import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// import { StrictMode } from "react";
import { PlayerProvider } from "./store/PlayerStore.tsx";
import { GameProvider } from "./store/GameStore.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <PlayerProvider>
    <GameProvider>
      <App />
    </GameProvider>
  </PlayerProvider>
  // </StrictMode>
);
