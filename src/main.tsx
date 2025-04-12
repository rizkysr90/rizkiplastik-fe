import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TanStackQueryProvider } from "./providers/query.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TanStackQueryProvider>
      <App />
    </TanStackQueryProvider>
  </StrictMode>
);
