import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.less";
import App from "./App.tsx";
import { createLocalREST } from "./localREST.ts";
import { initialData } from "./initial-data.ts";

const update = {
  forceUpdate: () => {},
};

function save(key: string, value: string) {
  localStorage.setItem(key, value);
  update.forceUpdate();
}

function load(key: string) {
  return localStorage.getItem(key) || undefined;
}

createLocalREST(save, load, initialData);

const resetState = () => createLocalREST(save, load, initialData, true);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App update={update} resetState={resetState} />
  </StrictMode>
);
