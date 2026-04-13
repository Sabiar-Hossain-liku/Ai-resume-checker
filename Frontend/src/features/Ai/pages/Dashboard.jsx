import React, { useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { useInterview } from '../hooks/useInterview'
import ReportDisplay from '../components/ReportDisplay'
import './dashboard.scss'

const Dashboard = () => {
    const { user, handleLogout } = useAuth()
    const { report, setReport, reports, generating, loadingReports, error, handleGenerate } = useInterview()

    const [resumeFile, setResumeFile] = useState(null)
    const [selfDescription, setSelfDescription] = useState("")
    const [jobDescription, setJobDescription] = useState("")
    const [dragOver, setDragOver] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!resumeFile) return
        await handleGenerate({ resumeFile, selfDescription, jobDescription })
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file?.type === "application/pdf") setResumeFile(file)
    }

    return (
        <div className="dashboard">
            {/* Navbar */}
            <nav className="navbar">
                <div className="container navbar-inner">
                    <div className="navbar-brand">
                        <span className="brand-icon">✦</span>
                        <span className="gradient-text brand-name">PrepAI</span>
                    </div>
                    <div className="navbar-right">
                        <div className="user-chip">
                            <div className="dot" />
                            <span>{user?.username || user?.email}</span>
                        </div>
                        <button
                            className="btn btn-ghost"
                            onClick={handleLogout}
                            id="logout-btn"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container dashboard-body">
                <div className="dashboard-layout">
                    {/* Left — Form */}
                    <aside className="form-panel fade-up">
                        <div className="panel-header">
                            <h2>Generate Report</h2>
                            <p>Upload your resume and describe the role</p>
                        </div>

                        <form onSubmit={onSubmit} className="report-form">
                            {/* PDF Drop Zone */}
                            <div
                                className={`drop-zone ${dragOver ? 'drag-over' : ''} ${resumeFile ? 'has-file' : ''}`}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('resume-input').click()}
                                id="resume-drop-zone"
                            >
                                <input
                                    type="file"
                                    id="resume-input"
                                    accept=".pdf"
                                    style={{ display: 'none' }}
                                    onChange={(e) => setResumeFile(e.target.files[0])}
                                />
                                {resumeFile ? (
                                    <div className="file-selected">
                                        <span className="file-icon">📄</span>
                                        <div>
                                            <p className="file-name">{resumeFile.name}</p>
                                            <p className="file-size">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                        <button
                                            type="button"
                                            className="file-remove"
                                            onClick={(e) => { e.stopPropagation(); setResumeFile(null) }}
                                        >×</button>
                                    </div>
                                ) : (
                                    <div className="drop-hint">
                                        <span className="drop-icon">⬆</span>
                                        <p>Drop your resume PDF here</p>
                                        <span>or click to browse</span>
                                    </div>
                                )}
                            </div>

                            <div className="input-group">
                                <label htmlFor="self-desc">About yourself</label>
                                <textarea
                                    id="self-desc"
                                    className="input textarea"
                                    placeholder="Briefly describe your background, skills, and experience..."
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    required
                                    rows={4}
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="job-desc">Job description</label>
                                <textarea
                                    id="job-desc"
                                    className="input textarea"
                                    placeholder="Paste the job description here..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    required
                                    rows={5}
                                />
                            </div>

                            {error && (
                                <div className="form-error fade-in">⚠ {error}</div>
                            )}

                            <button
                                className="btn btn-primary btn-lg generate-btn"
                                type="submit"
                                disabled={generating || !resumeFile}
                                id="generate-btn"
                            >
                                {generating ? (
                                    <>
                                        <span className="spinner" />
                                        Analyzing with AI...
                                    </>
                                ) : (
                                    <>
                                        <span>✦</span>
                                        Generate Report
                                    </>
                                )}
                            </button>
                        </form>

                        {/* History */}
                        {reports.length > 0 && (
                            <div className="history-panel">
                                <h3 className="history-title">Past Reports</h3>
                                <div className="history-list">
                                    {reports.map((r, i) => (
                                        <button
                                            key={r._id || i}
                                            className={`history-item ${report?._id === r._id ? 'active' : ''}`}
                                            onClick={() => setReport(r)}
                                        >
                                            <div className="history-item-left">
                                                <span className="history-score">{r.matchScore}%</span>
                                                <div>
                                                    <p className="history-job">{r.jobDescription?.slice(0, 40)}...</p>
                                                    <p className="history-date">
                                                        {new Date(r.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="history-arrow">›</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* Right — Report Display */}
                    <main className="report-panel">
                        {generating ? (
                            <div className="report-generating fade-in">
                                <div className="ai-pulse">
                                    <div className="ai-ring ring-1" />
                                    <div className="ai-ring ring-2" />
                                    <div className="ai-ring ring-3" />
                                    <span className="ai-core">✦</span>
                                </div>
                                <h3>AI is analyzing your profile...</h3>
                                <p>Generating personalized questions, skill gaps, and prep plan</p>
                                <div className="generating-steps">
                                    <div className="step animate-pulse">📄 Parsing resume</div>
                                    <div className="step animate-pulse" style={{ animationDelay: '0.3s' }}>🧠 Analyzing skills</div>
                                    <div className="step animate-pulse" style={{ animationDelay: '0.6s' }}>✦ Building report</div>
                                </div>
                            </div>
                        ) : report ? (
                            <ReportDisplay report={report} />
                        ) : (
                            <div className="report-empty fade-in">
                                <div className="empty-icon">✦</div>
                                <h3>Your report will appear here</h3>
                                <p>Fill in the form and click <strong>Generate Report</strong> to get your personalized interview preparation guide.</p>
                                <div className="empty-features">
                                    <div className="empty-feature">
                                        <span>🎯</span>
                                        <p>Match score analysis</p>
                                    </div>
                                    <div className="empty-feature">
                                        <span>💡</span>
                                        <p>Technical questions</p>
                                    </div>
                                    <div className="empty-feature">
                                        <span>🧠</span>
                                        <p>Behavioral coaching</p>
                                    </div>
                                    <div className="empty-feature">
                                        <span>📅</span>
                                        <p>Study plan</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
