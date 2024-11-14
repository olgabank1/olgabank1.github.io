import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.less";
import App from "./App.tsx";
import { deleteDatabase, doMigration } from "./db/index.ts";

await doMigration().catch((error) => {
  console.error("Migration failed", error);
  console.log("Deleting database and reloading page");
  deleteDatabase();
  //  location.reload();
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
