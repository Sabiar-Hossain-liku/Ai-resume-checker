const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const InterviewReportModel = require("../models/interviewReport.model")

async function generateInterviewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume PDF is required" })
        }
        const { selfDescription, jobDescription } = req.body
        if (!selfDescription || !jobDescription) {
            return res.status(400).json({ message: "selfDescription and jobDescription are required" })
        }

        const parsed = await pdfParse(req.file.buffer)
        const resumeText = parsed.text

        const aiReport = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription,
        })

        const interviewReport = await InterviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            // Handle both casing variants defensively
            matchScore: aiReport.matchScore ?? aiReport.matchscore ?? 0,
            technicalQuestions: aiReport.technicalQuestions,
            behavioralQuestions: aiReport.behavioralQuestions,
            // Normalize severity to lowercase to satisfy enum constraint
            skillGaps: (aiReport.skillGaps || []).map(g => ({
                skill: g.skill,
                severity: (g.severity || g.importance || "medium").toLowerCase(),
            })),
            preparationPlan: aiReport.preparationPlan,
        })

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport,
        })
    } catch (err) {
        console.error("generateInterviewReport error:", err.message || err)
        if (err.status === 429) {
            return res.status(429).json({
                message: "AI quota exceeded. Please wait a few hours and try again, or upgrade your Gemini API plan."
            })
        }
        res.status(500).json({ message: "Failed to generate report", error: err.message })
    }
}

async function getUserReportsController(req, res) {
    try {
        const reports = await InterviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume")
        res.status(200).json({ reports })
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch reports", error: err.message })
    }
}

module.exports = {
    generateReportHandler: generateInterviewReportController,
    getUserReportsHandler: getUserReportsController,
}