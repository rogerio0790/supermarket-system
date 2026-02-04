import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import { formatPrice, getMediaUrl } from '../utils/helpers';
import api from '../api/axios';
import './OrderConfirmationPage.css';

function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`orders/${orderId}/`);
      setOrder(response.data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Order not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="order-confirmation-page">
        <Header />
        <div className="confirmation-container">
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-confirmation-page">
        <Header />
        <div className="confirmation-container">
          <div className="error-state">
            <h2>Order Not Found</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/products')} className="btn-primary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <Header />

      <div className="confirmation-container">
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
              <p><strong>Phone:</strong> {order.delivery_phone}</p>
              {order.delivery_notes && (
                <p><strong>Notes:</strong> {order.delivery_notes}</p>
              )}
            </div>

            <div className="info-section">
              <h3>Payment Information</h3>
              <p><strong>Method:</strong> {order.payment_method_display}</p>
              <p><strong>Status:</strong> {order.payment_status_display}</p>
            </div>
          </div>

          <div className="order-items-section">
            <h3>Order Items</h3>
            <div className="order-items-list">
              {order.items?.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="order-item-image">
                    {item.product_image ? (
                      <img src={getMediaUrl(item.product_image)} alt={item.product_name} />
                    ) : (
                      <div className="no-image">📦</div>
                    )}
                  </div>
                  <div className="order-item-details">
                    <h4>{item.product_name}</h4>
                    <p>Qty: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <div className="order-item-total">
                    {formatPrice(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="total-row discount">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="total-row">
              <span>Delivery Fee</span>
              <span>FREE</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate('/products')} className="btn-continue">
            Continue Shopping
          </button>
          <button onClick={() => navigate('/orders')} className="btn-view-orders">
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;