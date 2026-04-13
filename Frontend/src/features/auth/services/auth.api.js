import axios from "axios"

// In production (Vercel), VITE_API_URL = "https://your-backend.azurewebsites.net"
// In development, empty string → Vite proxy handles /api → localhost:3000
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "",
    withCredentials: true,
})

export async function register({ username, email, password }) {
    const response = await api.post("/api/auth/register", { username, email, password })
    return response.data
}

export async function login({ email, password }) {
    const response = await api.post("/api/auth/login", { email, password })
    return response.data
}

export async function logout() {
    const response = await api.get("/api/auth/logout")
    return response.data
}

export async function getMe() {
    const response = await api.get("/api/auth/get-me")
    return response.data
}