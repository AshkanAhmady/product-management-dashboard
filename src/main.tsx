import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <App />
        <Toaster richColors position="top-right" />
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>,
);
