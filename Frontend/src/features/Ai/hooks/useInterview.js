import { useState, useEffect } from "react"
import { generateReport, getReports } from "../services/interview.api"

export function useInterview() {
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])
    const [generating, setGenerating] = useState(false)
    const [loadingReports, setLoadingReports] = useState(true)
    const [error, setError] = useState("")

    const fetchReports = async () => {
        try {
            const data = await getReports()
            setReports(data.reports || [])
        } catch (err) {
            console.error("Failed to fetch reports:", err)
        } finally {
            setLoadingReports(false)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [])

    const handleGenerate = async ({ resumeFile, selfDescription, jobDescription }) => {
        setError("")
        setGenerating(true)
        setReport(null)

        const formData = new FormData()
        formData.append("resume", resumeFile)
        formData.append("selfDescription", selfDescription)
        formData.append("jobDescription", jobDescription)

        try {
            const data = await generateReport(formData)
            setReport(data.interviewReport)
            setReports(prev => [data.interviewReport, ...prev])
            return { success: true }
        } catch (err) {
            const message = err.response?.data?.message || "Failed to generate report"
            setError(message)
            return { success: false, message }
        } finally {
            setGenerating(false)
        }
    }

    return { report, setReport, reports, generating, loadingReports, error, handleGenerate, fetchReports }
}
