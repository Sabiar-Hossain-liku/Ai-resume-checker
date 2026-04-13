const express = require("express")
const cookieParser = require("cookie-parser")

const cors =require("cors")
const app = express()


app.use(express.json())
app.use(cookieParser())

// CORS: allow localhost in dev, plus the production Vercel URL
const ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL,          // e.g. https://prepai.vercel.app
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true)
        if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true)
        callback(new Error(`CORS: origin ${origin} not allowed`))
    },
    credentials: true
}))



// Health check (for Docker & monitoring)
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() })
})

// Auth Route
const authRouter = require("./routes/auth.routes")
app.use("/api/auth",authRouter)

const interviewRouter = require("./routes/interview.routes")
app.use("/api/interview",interviewRouter)

module.exports = app