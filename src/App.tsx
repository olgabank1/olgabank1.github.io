import { createHashRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Index } from "./pages";
import { Side2 } from "./pages/side2";

const router = createHashRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "side2",
    element: <Side2 />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
