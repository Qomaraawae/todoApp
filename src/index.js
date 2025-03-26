import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Temukan root DOM element
const container = document.getElementById("root");

// Buat root
const root = createRoot(container);

// Render aplikasi
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
