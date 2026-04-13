import { createBrowserRouter } from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Protected from "./features/auth/components/Protected"
import Dashboard from "./features/Ai/pages/Dashboard"

function NotFound() {
    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: "100vh", gap: "1rem",
            fontFamily: "Inter, sans-serif", color: "#94a3b8",
            background: "#07070f"
        }}>
            <div style={{ fontSize: "5rem", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                404
            </div>
            <p style={{ fontSize: "1.1rem" }}>Page not found.</p>
            <a href="/" style={{ color: "#6366f1", fontSize: "0.9rem" }}>← Back to dashboard</a>
        </div>
    )
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected><Dashboard /></Protected>,
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
