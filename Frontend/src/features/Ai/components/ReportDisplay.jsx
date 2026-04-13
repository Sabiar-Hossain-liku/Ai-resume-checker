import React, { useState } from 'react'
import './ReportDisplay.scss'

function ScoreRing({ score }) {
    const radius = 52
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (score / 100) * circumference
    const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'

    return (
        <div className="score-ring-wrapper">
            <svg width="130" height="130" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <circle
                    cx="65" cy="65" r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 65 65)"
                    style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 8px ${color})` }}
                />
            </svg>
            <div className="score-center" style={{ color }}>
                <span className="score-number">{score}</span>
                <span className="score-label">/ 100</span>
            </div>
        </div>
    )
}

function Accordion({ title, icon, badge, badgeVariant = 'accent', children }) {
    const [open, setOpen] = useState(false)
    return (
        <div className={`accordion ${open ? 'open' : ''}`}>
            <button className="accordion-header" onClick={() => setOpen(!open)}>
                <div className="accordion-left">
                    <span className="accordion-icon">{icon}</span>
                    <span className="accordion-title">{title}</span>
                    {badge !== undefined && (
                        <span className={`badge badge-${badgeVariant}`}>{badge}</span>
                    )}
                </div>
                <span className={`accordion-chevron ${open ? 'rotated' : ''}`}>›</span>
            </button>
            {open && (
                <div className="accordion-body fade-up">
                    {children}
                </div>
            )}
        </div>
    )
}

function QuestionCard({ question, intension, answer, index }) {
    const [showAnswer, setShowAnswer] = useState(false)
    return (
        <div className="question-card fade-up" style={{ animationDelay: `${index * 0.06}s` }}>
            <div className="question-header">
                <span className="question-number">Q{index + 1}</span>
                <p className="question-text">{question}</p>
            </div>
            {intension && (
                <div className="question-intent">
                    <span>🎯</span>
                    <p><strong>Why they ask:</strong> {intension}</p>
                </div>
            )}
            <button
                className={`answer-toggle ${showAnswer ? 'open' : ''}`}
                onClick={() => setShowAnswer(!showAnswer)}
            >
                {showAnswer ? 'Hide answer' : 'Show sample answer'} <span>{showAnswer ? '∧' : '∨'}</span>
            </button>
            {showAnswer && (
                <div className="question-answer fade-up">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    )
}

const TABS = ['Overview', 'Technical', 'Behavioral', 'Skill Gaps', 'Study Plan']

const ReportDisplay = ({ report }) => {
    const [tab, setTab] = useState('Overview')
    const {
        matchScore,
        technicalQuestions = [],
        behavioralQuestions = [],
        skillGaps = [],
        preparationPlan = [],
        jobDescription,
        createdAt,
    } = report

    const score = matchScore || report.matchscore || 0

    return (
        <div className="report-display fade-up">
            {/* Report Header */}
            <div className="report-header">
                <div className="report-meta">
                    <h2>Interview Report</h2>
                    <p className="report-date">
                        {createdAt ? new Date(createdAt).toLocaleDateString('en-US', {
                            month: 'long', day: 'numeric', year: 'numeric'
                        }) : 'Just now'}
                    </p>
                </div>
                <div className="report-score-section">
                    <ScoreRing score={score} />
                    <p className="score-desc">Match Score</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs-bar">
                <div className="tabs-scroll">
                    {TABS.map(t => (
                        <button
                            key={t}
                            className={`tab-btn ${tab === t ? 'active' : ''}`}
                            onClick={() => setTab(t)}
                            id={`tab-${t.toLowerCase().replace(' ', '-')}`}
                        >
                            {t}
                            {t === 'Technical' && <span className="tab-count">{technicalQuestions.length}</span>}
                            {t === 'Behavioral' && <span className="tab-count">{behavioralQuestions.length}</span>}
                            {t === 'Skill Gaps' && <span className="tab-count">{skillGaps.length}</span>}
                            {t === 'Study Plan' && <span className="tab-count">{preparationPlan.length}d</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="tab-content" key={tab}>

                {tab === 'Overview' && (
                    <div className="overview-tab fade-up">
                        <div className="overview-grid">
                            <div className="stat-card">
                                <div className="stat-icon tech">💡</div>
                                <div className="stat-value">{technicalQuestions.length}</div>
                                <div className="stat-label">Technical Questions</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon behav">🧠</div>
                                <div className="stat-value">{behavioralQuestions.length}</div>
                                <div className="stat-label">Behavioral Questions</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon gap">⚡</div>
                                <div className="stat-value">{skillGaps.length}</div>
                                <div className="stat-label">Skill Gaps Found</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon plan">📅</div>
                                <div className="stat-value">{preparationPlan.length}</div>
                                <div className="stat-label">Day Prep Plan</div>
                            </div>
                        </div>

                        {jobDescription && (
                            <div className="overview-jd">
                                <h4>Job Target</h4>
                                <p>{jobDescription.slice(0, 300)}{jobDescription.length > 300 ? '...' : ''}</p>
                            </div>
                        )}

                        <div className="overview-quickview">
                            <Accordion title="Top Skill Gaps" icon="⚡" badge={skillGaps.length} badgeVariant="danger">
                                <div className="gap-mini-list">
                                    {skillGaps.slice(0, 3).map((g, i) => (
                                        <div key={i} className="gap-mini">
                                            <span className="badge badge-warning">{g.importance}</span>
                                            <p>{g.skill}</p>
                                        </div>
                                    ))}
                                </div>
                            </Accordion>
                        </div>
                    </div>
                )}

                {tab === 'Technical' && (
                    <div className="questions-tab fade-up">
                        <p className="tab-desc">
                            These questions are likely to come up in your technical interview based on the job description.
                        </p>
                        <div className="questions-list">
                            {technicalQuestions.map((q, i) => (
                                <QuestionCard key={i} index={i} {...q} />
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'Behavioral' && (
                    <div className="questions-tab fade-up">
                        <p className="tab-desc">
                            Practice these behavioral questions using the STAR method (Situation, Task, Action, Result).
                        </p>
                        <div className="questions-list">
                            {behavioralQuestions.map((q, i) => (
                                <QuestionCard key={i} index={i} {...q} />
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'Skill Gaps' && (
                    <div className="skills-tab fade-up">
                        <p className="tab-desc">
                            Focus on these areas to become a stronger candidate.
                        </p>
                        <div className="skills-list">
                            {skillGaps.map((gap, i) => (
                                <div
                                    key={i}
                                    className="skill-card fade-up"
                                    style={{ animationDelay: `${i * 0.06}s` }}
                                >
                                    <div className="skill-header">
                                        <div>
                                            <p className="skill-name">{gap.skill}</p>
                                            <span className={`badge ${
                                                gap.importance?.toLowerCase().includes('high') ? 'badge-danger' :
                                                gap.importance?.toLowerCase().includes('medium') ? 'badge-warning' :
                                                'badge-accent'
                                            }`}>{gap.importance}</span>
                                        </div>
                                    </div>
                                    {gap.resources?.length > 0 && (
                                        <div className="skill-resources">
                                            <p className="resources-label">📚 Resources</p>
                                            <ul>
                                                {gap.resources.map((r, ri) => (
                                                    <li key={ri}>{r}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'Study Plan' && (
                    <div className="plan-tab fade-up">
                        <p className="tab-desc">
                            Follow this day-by-day plan to systematically prepare for your interview.
                        </p>
                        <div className="plan-timeline">
                            {preparationPlan.map((day, i) => (
                                <div
                                    key={i}
                                    className="plan-day fade-up"
                                    style={{ animationDelay: `${i * 0.06}s` }}
                                >
                                    <div className="plan-day-marker">
                                        <div className="day-circle">{day.day}</div>
                                        {i < preparationPlan.length - 1 && <div className="day-line" />}
                                    </div>
                                    <div className="plan-day-content">
                                        <h4 className="day-focus">{day.focus}</h4>
                                        <ul className="day-tasks">
                                            {day.tasks?.map((task, ti) => (
                                                <li key={ti}>{task}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReportDisplay
