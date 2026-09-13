import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import NestoraApp from "./NestoraApp";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NestoraApp />
  </StrictMode>,
);
