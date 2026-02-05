import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, getMediaUrl } from '../../utils/helpers';
import './OrderConfirmationModal.css';

const OrderConfirmationModal = ({ isOpen, order, onClose }) => {
  const navigate = useNavigate();
  const modalRef = useRef();

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

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="order-modal-backdrop" onClick={handleBackdropClick}>
      <div className="order-modal-container" ref={modalRef}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <div className="order-modal-content">
          <div className="success-header">
            <div className="success-icon">✓</div>
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your order. We'll deliver it soon.</p>
          </div>

          <div className="order-details-card">
            <div className="order-header">
              <div>
                <h2>Order #{order.order_number}</h2>
                <p className="order-date">
                  Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="order-status">
                <span className={`status-badge ${order.status}`}>
                  {order.status_display}
                </span>
              </div>
            </div>

            <div className="order-info-grid">
              <div className="info-section">
                <h3>Delivery Information</h3>
                <p><strong>Address:</strong> {order.delivery_address}</p>
                <p><strong>Phone:</strong> {order.phone_number}</p>
              </div>

              <div className="info-section">
                <h3>Payment Information</h3>
                <p><strong>Method:</strong> {order.payment_method_display}</p>
                <p><strong>Total:</strong> {formatPrice(Number(order.total))}</p>
              </div>
            </div>

            <div className="order-items-summary">
              <h3>Order Summary</h3>
              <div className="items-preview">
                {order.items?.slice(0, 3).map((item) => (
                  <div key={item.id} className="preview-item">
                    <div className="preview-image">
                      {item.product_image ? (
                        <img src={getMediaUrl(item.product_image)} alt={item.product_name} />
                      ) : (
                        <div className="no-image">📦</div>
                      )}
                    </div>
                    <div className="preview-details">
                      <span className="item-name">{item.product_name}</span>
                      <span className="item-qty">Qty: {item.quantity}</span>
                    </div>
                    <div className="item-price">
                      {formatPrice(Number(item.total_price || (item.quantity * (item.product_price || 0))))}
                    </div>
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <div className="more-items">
                    And {order.items.length - 3} more items...
                  </div>
                )}
              </div>
            </div>

            <div className="order-totals">
              <div className="total-row grand-total">
                <span>Total Amount</span>
                <span>{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button 
              onClick={() => {
                onClose();
                navigate('/products');
              }} 
              className="btn-continue"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => {
                onClose();
                navigate('/account'); // Assuming orders are in account page or a separate orders page
              }} 
              className="btn-view-orders"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;
