import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";

const router = createBrowserRouter(
  [
    { path: "/", element: <HomePage /> },
    { path: "/game/:roomId", element: <GamePage /> },
  ],
  { basename: "/keyclash" }
);

export default function App() {
  return (
    <>
      <h1 className="text-4xl uppercase mb-4">KEY-CLASH!</h1>
      <RouterProvider router={router} />
    </>
  );
}
