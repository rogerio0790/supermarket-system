import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import api from '../api/axios';
import './VerifyOTPPage.css';

function VerifyOTPPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openAuthModal } = useModal();
  const phoneNumber = location.state?.phone_number || '';
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('Please enter 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await api.post('notifications/verify-otp/', {
        phone_number: phoneNumber,
        otp_code: otp
      });
      
      alert('Account verified successfully! Please login.');
      openAuthModal('login');
      navigate('/'); // Redirect to home after showing modal
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResending(true);
      setError('');
      
      await api.post('notifications/resend-otp/', {
        phone_number: phoneNumber
      });
      
      alert('OTP resent to your phone!');
      setOtp('');
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (!phoneNumber) {
    return (
      <div className="verify-otp-page">
        <div className="verify-otp-container">
          <div className="verify-otp-box">
            <h2>Invalid Access</h2>
            <p>Please register first to verify your account.</p>
            <button onClick={() => navigate('/register')} className="btn-verify">
              Go to Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-otp-page">
      <div className="verify-otp-container">
        <div className="verify-otp-box">
          <div className="otp-logo">
            <span className="logo-icon">🛒</span>
            <h1>RUKARA SUPERMARKET</h1>
          </div>

          <h2>Verify Your Phone Number</h2>
          <p className="otp-instruction">
            We've sent a 6-digit verification code to:<br/>
            <strong>{phoneNumber}</strong>
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <label>Enter OTP Code</label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="otp-input"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn-verify"
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div className="resend-section">
            <p>Didn't receive the code?</p>
            <button 
              onClick={handleResendOTP}
              className="btn-resend"
              disabled={resending}
            >
              {resending ? 'Resending...' : 'Resend OTP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTPPage;
