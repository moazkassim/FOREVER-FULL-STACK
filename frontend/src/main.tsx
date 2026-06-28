import { createRoot } from "react-dom/client";

import { App } from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.tsx";
import "./index.css";
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  </BrowserRouter>,
);
