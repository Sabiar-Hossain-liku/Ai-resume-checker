const express = require('express');
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router();

interviewRouter.post("/generateReport", authMiddleware, upload.single("resume"), interviewController.generateReportHandler)
interviewRouter.get("/reports", authMiddleware, interviewController.getUserReportsHandler)

module.exports = interviewRouter;