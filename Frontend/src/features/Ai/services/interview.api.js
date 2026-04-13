import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "",
    withCredentials: true,
})

export async function generateReport(formData) {
    const response = await api.post("/api/interview/generateReport", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
}

export async function getReports() {
    const response = await api.get("/api/interview/reports")
    return response.data
}
