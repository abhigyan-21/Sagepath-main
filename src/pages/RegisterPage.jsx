import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

    function validate() {
        if (!name) return 'Please enter your name.';
        if (!email) return 'Please enter your email.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email.';
        if (!password) return 'Please enter your password.';
        if (password.length < 6) return 'Password must be at least 6 characters.';
        if (password !== confirmPassword) return 'Passwords do not match.';
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
            const data = await authAPI.register(name, email, password);
            
            // Check if email confirmation is required
            if (data.requiresConfirmation) {
                // Show success message and redirect to login
                alert(data.message);
                navigate('/login');
                return;
            }
            
            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Clear form
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setError('');
            
            // Navigate to homepage
            navigate('/homepage');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page login-standalone">
            <div className="login-card">
                <h2>Create Account</h2>
                <p className="muted">Join Sagepath and start learning</p>

                <form onSubmit={handleSubmit} className="login-form" autoComplete="on">
                    <label>
                        <span className="label-text">Name</span>
                        <input
                            type="text"
                            name="name"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            required
                        />
                    </label>

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
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            required
                        />
                    </label>

                    <label>
                        <span className="label-text">Confirm Password</span>
                        <input
                            type="password"
                            name="confirm-password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            required
                        />
                    </label>

                    {error && <div className="form-error">{error}</div>}

                    <button className="btn primary" type="submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                    <div className="login-help">
                        <a href="/login">Already have an account? Sign in</a>
                    </div>
                </form>
            </div>
        </div>
    );
}
