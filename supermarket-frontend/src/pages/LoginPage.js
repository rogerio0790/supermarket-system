import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import './AuthPages.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const { openAuthModal } = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/', { replace: true });
    openAuthModal('login');
  }, [navigate, openAuthModal]);

  return null;
}

export default LoginPage;
