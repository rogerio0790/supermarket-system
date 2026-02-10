import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import api from '../../api/axios';
import './AuthModals.css';

const AuthModals = ({ isOpen, initialMode = 'login', onClose }) => {
  const { login, register, googleLogin } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'otp', 'forgot-password', 'reset-password', 'success'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const modalRef = useRef();
  const otpRefs = useRef([]);

  useEffect(() => {
    setMode(initialMode);
    setError('');
    setMessage('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
    });
    setOtp(['', '', '', '', '', '']);
  }, [isOpen, initialMode]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    const data = e.clipboardData.getData('text').slice(0, 6).split('');
    if (data.every(char => !isNaN(char))) {
      const newOtp = [...otp];
      data.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      if (data.length < 6) {
        otpRefs.current[data.length].focus();
      } else {
        otpRefs.current[5].focus();
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.non_field_errors?.[0] || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      await googleLogin({
        email: decoded.email,
        first_name: decoded.given_name,
        last_name: decoded.family_name,
        social_id: decoded.sub,
        avatar: decoded.picture
      });
      onClose();
    } catch (err) {
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phone,
      };
      await register(userData);
      setMode('otp');
      setResendTimer(60);
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const firstError = Object.values(data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError || 'Registration failed');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter the full 6-digit code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('notifications/verify-otp/', {
        phone_number: formData.phone,
        otp_code: otpCode,
      });
      setMode('success');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('auth/forgot-password/', { email: formData.email });
      setMode('reset-password');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter the 6-digit reset code');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('auth/reset-password/', {
        email: formData.email,
        otp: otpCode,
        password: formData.password,
      });
      setMessage('Password reset successful! Please sign in.');
      setMode('login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      await api.post('notifications/resend-otp/', {
        phone_number: formData.phone,
      });
      setResendTimer(60);
      setError('');
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-backdrop" onClick={handleBackdropClick}>
      <div className={`auth-modal-container ${mode}`} ref={modalRef}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <div className="auth-modal-content">
          {mode === 'login' && (
            <div className="auth-form-wrapper">
              <h2>Welcome Back</h2>
              <p>Sign in to continue shopping</p>
              
              {message && <div className="auth-success" style={{color: '#00c853', marginBottom: '15px', textAlign: 'center'}}>{message}</div>}
              
              <div className="google-auth-container" style={{marginBottom: '20px', display: 'flex', justifyContent: 'center'}}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google login failed')}
                  useOneTap={false}
                  shape="pill"
                  theme="outline"
                  width="100%"
                />
              </div>

              <div className="auth-divider" style={{display: 'flex', alignItems: 'center', margin: '15px 0', color: '#999'}}>
                <div style={{flex: 1, height: '1px', background: '#eee'}}></div>
                <span style={{padding: '0 10px', fontSize: '12px'}}>OR</span>
                <div style={{flex: 1, height: '1px', background: '#eee'}}></div>
              </div>

              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <label>Password</label>
                    <button type="button" className="text-link" onClick={() => setMode('forgot-password')} style={{fontSize: '12px', background: 'none', border: 'none', color: '#666', cursor: 'pointer'}}>Forgot Password?</button>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                {error && <div className="auth-error">{error}</div>}
                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? <span className="spinner"></span> : 'Sign In'}
                </button>
              </form>
              <div className="auth-switch">
                Don't have an account? <button onClick={() => setMode('register')}>Sign Up</button>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div className="auth-form-wrapper">
              <h2>Create Account</h2>
              <p>Join Rukara Supermarket today</p>

              <div className="google-auth-container" style={{marginBottom: '20px', display: 'flex', justifyContent: 'center'}}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google login failed')}
                  useOneTap={false}
                  shape="pill"
                  theme="outline"
                  width="100%"
                  text="signup_with"
                />
              </div>

              <div className="auth-divider" style={{display: 'flex', alignItems: 'center', margin: '15px 0', color: '#999'}}>
                <div style={{flex: 1, height: '1px', background: '#eee'}}></div>
                <span style={{padding: '0 10px', fontSize: '12px'}}>OR</span>
                <div style={{flex: 1, height: '1px', background: '#eee'}}></div>
              </div>

              <form onSubmit={handleRegister}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+250..."
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                {error && <div className="auth-error">{error}</div>}
                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? <span className="spinner"></span> : 'Sign Up'}
                </button>
              </form>
              <div className="auth-switch">
                Already have an account? <button onClick={() => setMode('login')}>Sign In</button>
              </div>
            </div>
          )}

          {mode === 'forgot-password' && (
            <div className="auth-form-wrapper">
              <h2>Forgot Password</h2>
              <p>Enter your email to receive a reset code</p>
              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    required
                  />
                </div>
                {error && <div className="auth-error">{error}</div>}
                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? <span className="spinner"></span> : 'Send Reset Code'}
                </button>
              </form>
              <div className="auth-switch">
                Back to <button onClick={() => setMode('login')}>Sign In</button>
              </div>
            </div>
          )}

          {mode === 'reset-password' && (
            <div className="auth-form-wrapper">
              <h2>Reset Password</h2>
              <p>Enter the code sent to {formData.email}</p>
              <form onSubmit={handleResetPassword}>
                <div className="otp-input-container">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      ref={(el) => (otpRefs.current[index] = el)}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                    />
                  ))}
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                  />
                </div>
                {error && <div className="auth-error">{error}</div>}
                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? <span className="spinner"></span> : 'Reset Password'}
                </button>
              </form>
            </div>
          )}

          {mode === 'otp' && (
            <div className="auth-form-wrapper otp-mode">
              <div className="icon-circle">📲</div>
              <h2>Verify Your Phone</h2>
              <p>We've sent a 6-digit code to <strong>{formData.phone}</strong></p>
              <form onSubmit={handleVerifyOtp}>
                <div className="otp-input-container">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      ref={(el) => (otpRefs.current[index] = el)}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                    />
                  ))}
                </div>
                {error && <div className="auth-error">{error}</div>}
                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? <span className="spinner"></span> : 'Verify Code'}
                </button>
              </form>
              <div className="resend-container">
                {resendTimer > 0 ? (
                  <span>Resend code in {resendTimer}s</span>
                ) : (
                  <button onClick={handleResendOtp} disabled={loading}>Resend Code</button>
                )}
              </div>
            </div>
          )}

          {mode === 'success' && (
            <div className="auth-form-wrapper success-mode">
              <div className="success-checkmark">
                <div className="check-icon">
                  <span className="icon-line line-tip"></span>
                  <span className="icon-line line-long"></span>
                  <div className="icon-circle"></div>
                  <div className="icon-fix"></div>
                </div>
              </div>
              <h2>Account Verified!</h2>
              <p>Your account has been successfully created and verified. You can now sign in to your account.</p>
              <button className="auth-submit-btn" onClick={() => setMode('login')}>
                Proceed to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModals;
