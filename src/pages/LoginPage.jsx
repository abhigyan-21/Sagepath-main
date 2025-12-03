import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    function validate() {
        if (!email) return 'Please enter your email.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email.';
        if (!password) return 'Please enter your password.';
        if (password.length < 6) return 'Password must be at least 6 characters.';
        return '';
    }

    const navigate = useNavigate();

    useEffect(() => {
        // ensure page is scrolled to top when login page mounts
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

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
            const { authAPI } = await import('../services/api.js');
            const data = await authAPI.login(email, password);

            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Clear form
            setEmail('');
            setPassword('');
            setError('');

            // Navigate to homepage
            navigate('/homepage');
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page login-standalone">
            <div className="login-card">
                <h2>Welcome</h2>
                <p className="muted">Sign in to continue to Sagepath</p>

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

                    <label>
                        <span className="label-text">Password</span>
                        <input
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="enter password"
                            required
                        />
                    </label>

                    {error && <div className="form-error">{error}</div>}

                    <button className="btn primary" type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <div className="login-help">
                        <a href="/forgot-password">Forgot password?</a>
                        <a href="/register">Create account</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
