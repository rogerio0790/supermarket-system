import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import './AuthPages.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { openAuthModal } = useModal();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (formData.password !== formData.password2) {
    setError('Passwords do not match');
    return;
  }

  setLoading(true);

  try {
    await register(formData);
    // Redirect to OTP verification page
    navigate('/verify-otp', { 
      state: { phone_number: formData.phone } 
    });
  } catch (err) {
    console.error('Registration error details:', err.response?.data);
    
    // Handle specific field errors from Django
    if (err.response?.data) {
      const errorData = err.response.data;
      
      if (errorData.email) {
        setError(`Email: ${errorData.email[0]}`);
      } else if (errorData.phone) {
        setError(`Phone: ${errorData.phone[0]}`);
      } else if (errorData.password) {
        setError(`Password: ${errorData.password[0]}`);
      } else if (errorData.error) {
        setError(errorData.error);
      } else {
        setError('Registration failed. Please check all fields and try again.');
      }
    } else {
      setError('Registration failed. Please try again.');
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
          <h1>RUKARA</h1>
          <p>PREMIUM MARKET</p>
        </div>

        <h2>Create Account</h2>
        <p className="auth-subtitle">Join Rukara Supermarket today</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First name"
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g., +250788123456"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              placeholder="Re-enter password"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <button onClick={() => openAuthModal('login')} className="btn-link">Sign In</button>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
