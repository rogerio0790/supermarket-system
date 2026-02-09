import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axios';
import './AuthPages.css';

function ResetPasswordPage() {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('auth/reset-password/', { email, otp, password });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Reset Password</h2>
        <p className="auth-subtitle">Enter the OTP sent to {email} and your new password</p>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message" style={{color: '#00c853', marginBottom: '20px'}}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>OTP Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Re-enter new password"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <p className="auth-footer">
          Remembered your password? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
