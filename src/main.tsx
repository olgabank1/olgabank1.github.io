import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.less";
import App from "./App.tsx";
import { migrate } from "./db/migrate";

await migrate();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
