import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import api from '../api/axios';

function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { openOrderModal } = useModal();

  useEffect(() => {
    const fetchAndShowOrder = async () => {
      try {
        const response = await api.get(`orders/${orderId}/`);
        // Redirect to home and open the order modal
        navigate('/', { replace: true });
        openOrderModal(response.data);
      } catch (err) {
        console.error('Error fetching order for modal:', err);
        navigate('/', { replace: true });
      }
    };

    if (orderId) {
      fetchAndShowOrder();
    } else {
      navigate('/', { replace: true });
    }
  }, [orderId, navigate, openOrderModal]);

  return null;
}

export default OrderConfirmationPage;
