import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import './AuthPages.css';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('auth/forgot-password/', { email });
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Forgot Password</h2>
        <p className="auth-subtitle">Enter your email to receive a password reset OTP</p>
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
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset OTP'}
          </button>
        </form>
        <p className="auth-footer">
          Back to <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
