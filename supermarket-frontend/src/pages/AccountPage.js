import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './AccountPage.css';

function AccountPage() {
  const { user, checkAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: ''
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password2: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        city: user.city || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await api.patch('auth/profile/update/', profileData);
      await checkAuth();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password2) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post('auth/change-password/', passwordData);
      setPasswordData({ old_password: '', new_password: '', new_password2: '' });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to change password.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="account-page">
        <Header />
        <div className="account-container">
          <p>Please login to view your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <Header />
      <div className="account-container">
        <h1>My Account</h1>
        
        <div className="account-tabs">
          <button 
            className={activeTab === 'profile' ? 'active' : ''} 
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button 
            className={activeTab === 'password' ? 'active' : ''} 
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </button>
        </div>

        {message.text && (
          <div className={`message-banner ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="tab-content">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="account-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    name="first_name" 
                    value={profileData.first_name} 
                    onChange={handleProfileChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    name="last_name" 
                    value={profileData.last_name} 
                    onChange={handleProfileChange} 
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address (Cannot be changed)</label>
                <input 
                  type="email" 
                  name="email" 
                  value={profileData.email} 
                  disabled 
                  className="disabled-input"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone_number" 
                  value={profileData.phone_number} 
                  onChange={handleProfileChange} 
                />
              </div>
              <div className="form-group">
                <label>Delivery Address</label>
                <textarea 
                  name="address" 
                  value={profileData.address} 
                  onChange={handleProfileChange} 
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input 
                  type="text" 
                  name="city" 
                  value={profileData.city} 
                  onChange={handleProfileChange} 
                />
              </div>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? 'Saving...' : 'Update Profile'}
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="account-form">
              <div className="form-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  name="old_password" 
                  value={passwordData.old_password} 
                  onChange={handlePasswordChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  name="new_password" 
                  value={passwordData.new_password} 
                  onChange={handlePasswordChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  name="new_password2" 
                  value={passwordData.new_password2} 
                  onChange={handlePasswordChange} 
                  required 
                />
              </div>
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
