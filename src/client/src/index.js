import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import "./assets/css/index.css";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
