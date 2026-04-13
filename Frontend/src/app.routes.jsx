import { createBrowserRouter, Navigate } from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"

function NotFound() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100vh", gap: "1rem",
      fontFamily: "sans-serif", color: "#555"
    }}>
      <h1 style={{ fontSize: "4rem", margin: 0 }}>404</h1>
      <p>Page not found.</p>
      <a href="/login" style={{ color: "#6366f1", textDecoration: "none" }}>← Go to Login</a>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
])
