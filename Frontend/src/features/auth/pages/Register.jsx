import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import '../auth.form.scss'

const Register = () => {
    const navigate = useNavigate()
    const { loading, handleRegister } = useAuth()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }
        setSubmitting(true)
        const result = await handleRegister({ username, email, password })
        setSubmitting(false)
        if (result.success) {
            navigate('/')
        } else {
            setError(result.message)
        }
    }

    if (loading && !submitting) {
        return (
            <div className="page-loader">
                <div className="spinner spinner-lg" />
                <span>Loading...</span>
            </div>
        )
    }

    return (
        <main className="auth-main">
            <div className="auth-bg-orbs">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
            </div>
            <div className="auth-card fade-up">
                <div className="auth-logo">
                    <span className="auth-logo-icon">✦</span>
                    <span className="gradient-text">PrepAI</span>
                </div>
                <h1 className="auth-title">Create account</h1>
                <p className="auth-subtitle">Start your AI-powered interview preparation</p>

                {error && (
                    <div className="auth-error fade-in">
                        <span>⚠</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            className="input"
                            type="text"
                            id="username"
                            placeholder="johndoe"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email address</label>
                        <input
                            className="input"
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            className="input"
                            type="password"
                            id="password"
                            placeholder="Min. 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <button
                        className="btn btn-primary btn-lg auth-submit"
                        type="submit"
                        disabled={submitting}
                        id="register-btn"
                    >
                        {submitting ? <><span className="spinner" /> Creating account...</> : 'Create Account'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </main>
    )
}

export default Register