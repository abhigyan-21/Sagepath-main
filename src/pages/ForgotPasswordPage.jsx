import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function validate() {
        if (!email) return 'Please enter your email.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email.';
        return '';
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        
        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        setLoading(true);
        
        try {
            await authAPI.resetPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="login-page login-standalone">
                <div className="login-card">
                    <h2>Check Your Email</h2>
                    <p className="muted">
                        We've sent a password reset link to <strong>{email}</strong>
                    </p>
                    <p style={{ marginTop: '1rem' }}>
                        Click the link in the email to reset your password.
                    </p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="btn primary"
                        style={{ marginTop: '1.5rem' }}
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page login-standalone">
            <div className="login-card">
                <h2>Forgot Password</h2>
                <p className="muted">Enter your email to receive a password reset link</p>

                <form onSubmit={handleSubmit} className="login-form" autoComplete="on">
                    <label>
                        <span className="label-text">Email</span>
                        <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@domain.com"
                            required
                        />
                    </label>

                    {error && <div className="form-error">{error}</div>}

                    <button className="btn primary" type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <div className="login-help">
                        <a href="/login">Back to Login</a>
                        <a href="/register">Create account</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
