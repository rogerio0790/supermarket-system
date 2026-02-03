import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    await login(email, password);
    navigate('/');
  } catch (err) {
    console.error('Login error:', err);
    
    // Check if user is not verified
    if (err.response?.status === 401 || err.response?.status === 400) {
      const errorMsg = err.response?.data?.error || '';
      if (errorMsg.includes('verify') || errorMsg.includes('OTP')) {
        setError('Please verify your account with OTP first.');
      } else {
        setError('Invalid email or password.');
      }
    } else {
      setError('Login failed. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">
          <span className="logo-icon">🛒</span>
          <h1>FreshMart</h1>
          <p>Fresh & Fast</p>
        </div>

        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;