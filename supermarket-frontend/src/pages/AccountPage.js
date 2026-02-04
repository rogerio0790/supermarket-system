import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './AccountPage.css';

function AccountPage() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const [profile, setProfile] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    city: '',
  });
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    new_password2: '',
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await api.get('auth/profile/');
        setProfile({
          email: response.data.email || '',
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
          phone_number: response.data.phone_number || '',
          address: response.data.address || '',
          city: response.data.city || '',
        });
      } catch (error) {
        setProfileError('Unable to load your profile. Please refresh.');
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileMessage('');
    setProfileError('');

    try {
      await api.put('auth/profile/update/', profile);
      setProfileMessage('Profile updated successfully.');
      await checkAuth();
    } catch (error) {
      setProfileError(
        error.response?.data?.detail ||
        error.response?.data?.email?.[0] ||
        'Failed to update profile. Please try again.'
      );
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    try {
      await api.post('auth/change-password/', passwordForm);
      setPasswordMessage('Password updated successfully.');
      setPasswordForm({ old_password: '', new_password: '', new_password2: '' });
    } catch (error) {
      setPasswordError(
        error.response?.data?.detail ||
        error.response?.data?.old_password?.[0] ||
        error.response?.data?.new_password?.[0] ||
        'Failed to update password. Please try again.'
      );
    }
  };

  return (
    <div className="account-page">
      <Header />
      <div className="account-container">
        <div className="account-header">
          <h1>My Account</h1>
          <p>Manage your profile details and security settings.</p>
        </div>

        <div className="account-grid">
          <section className="account-card">
            <h2>Profile Information</h2>
            <p className="card-subtitle">Keep your contact details up to date for smooth deliveries.</p>

            {profileMessage && <div className="success-message">{profileMessage}</div>}
            {profileError && <div className="error-message">{profileError}</div>}

            <form onSubmit={handleProfileSubmit} className="account-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={profile.phone_number}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={profile.first_name}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={profile.last_name}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Delivery Address</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleProfileChange}
                />
              </div>

              <button type="submit" className="btn-primary">
                Save Profile
              </button>
            </form>
          </section>

          <section className="account-card">
            <h2>Change Password</h2>
            <p className="card-subtitle">Update your password to keep your account secure.</p>

            {passwordMessage && <div className="success-message">{passwordMessage}</div>}
            {passwordError && <div className="error-message">{passwordError}</div>}

            <form onSubmit={handlePasswordSubmit} className="account-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="old_password"
                  value={passwordForm.old_password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="new_password"
                    value={passwordForm.new_password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="new_password2"
                    value={passwordForm.new_password2}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-secondary">
                Update Password
              </button>
            </form>
          </section>

          <section className="account-card profile-summary">
            <h2>Profile Summary</h2>
            <div className="summary-item">
              <span>Name</span>
              <strong>{profile.first_name} {profile.last_name}</strong>
            </div>
            <div className="summary-item">
              <span>Email</span>
              <strong>{profile.email}</strong>
            </div>
            <div className="summary-item">
              <span>Phone</span>
              <strong>{profile.phone_number || 'Not provided'}</strong>
            </div>
            <div className="summary-item">
              <span>Address</span>
              <strong>{profile.address || 'Not provided'}</strong>
            </div>
            <div className="summary-item">
              <span>City</span>
              <strong>{profile.city || 'Not provided'}</strong>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
