import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import Blocks from "./components/Blocks";
import "./assets/css/index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TransactionForm from "./components/TransactionForm";
import TransacationPool from "./components/TransactionPool";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/blocks",
    element: <Blocks />,
  },
  {
    path: "/transact",
    element: <TransactionForm />,
  },
  {
    path: "/transaction-pool",
    element: <TransacationPool />,
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
