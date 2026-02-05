import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';

function LoginPage() {
  const navigate = useNavigate();
  const { openAuthModal } = useModal();

  useEffect(() => {
    // Redirect to home and open the login modal
    navigate('/', { replace: true });
    openAuthModal('login');
  }, [navigate, openAuthModal]);

  return null; // This page doesn't need to render anything
}

export default LoginPage;
