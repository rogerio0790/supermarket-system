import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { openAuthModal } = useModal();

  useEffect(() => {
    navigate('/', { replace: true });
    openAuthModal('register');
  }, [navigate, openAuthModal]);

  return null;
}

export default RegisterPage;
