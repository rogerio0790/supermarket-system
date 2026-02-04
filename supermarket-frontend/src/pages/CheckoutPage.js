import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, getMediaUrl } from '../utils/helpers';
import api from '../api/axios';
import './CheckoutPage.css';

function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loading: cartLoading, clearCart } = useCart();

  const [deliveryInfo, setDeliveryInfo] = useState({
    delivery_address: '',
    delivery_city: 'Musanze', // Default city as per business location
    phone_number: user?.phone || '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ---------- Guards ----------
  if (!user) {
    return (
      <div className="checkout-page">
        <Header />
        <div className="checkout-container">
          <div className="empty-state">
            <h2>Please Login</h2>
            <p>You need to be logged in to checkout</p>
            <button onClick={() => navigate('/login')} className="btn-primary">
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="checkout-page">
        <Header />
        <div className="checkout-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="checkout-page">
        <Header />
        <div className="checkout-container">
          <div className="empty-state">
            <h2>Your cart is empty</h2>
            <p>Add items to cart before checkout</p>
            <button
              onClick={() => navigate('/products')}
              className="btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Handlers ----------
  const handleInputChange = (e) => {
    setDeliveryInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!deliveryInfo.delivery_address.trim()) {
      setError('Please enter a delivery address');
      return;
    }

    if (!deliveryInfo.delivery_city.trim()) {
      setError('Please enter a delivery city');
      return;
    }

    if (!deliveryInfo.phone_number.trim()) {
      setError('Please enter a delivery phone number');
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        delivery_address: deliveryInfo.delivery_address,
        delivery_city: deliveryInfo.delivery_city,
        phone_number: deliveryInfo.phone_number,
        notes: deliveryInfo.notes,
        payment_method: paymentMethod,
        delivery_fee: 0, // Ensure delivery_fee is sent to avoid validation error
      };

      console.log('Sending order data:', orderData);

      const response = await api.post('orders/create/', orderData);

      console.log('Order response:', response.data);
      
      // Clear cart context after successful order
      await clearCart();
      
      // Navigate using order_number as expected by the confirmation page's backend lookup
      navigate(`/order-confirmation/${response.data.order_number}`);
    } catch (err) {
      console.error('Order placement error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);

      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Failed to place order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI ----------
  return (
    <div className="checkout-page">
      <Header />

      <div className="checkout-container">
        <h1>Checkout</h1>

        <div className="checkout-content">
          {/* Form */}
          <div className="checkout-form-section">
            <form onSubmit={handlePlaceOrder}>
              <div className="form-section">
                <h2>Delivery Information</h2>

                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                  <label>Delivery Address *</label>
                  <textarea
                    name="delivery_address"
                    value={deliveryInfo.delivery_address}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Delivery City *</label>
                  <input
                    type="text"
                    name="delivery_city"
                    value={deliveryInfo.delivery_city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Delivery Phone *</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={deliveryInfo.phone_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Delivery Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={deliveryInfo.notes}
                    onChange={handleInputChange}
                    rows="2"
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>Payment Method</h2>

                <label className="payment-option">
                  <input
                    type="radio"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cash on Delivery
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    value="mobile_money"
                    checked={paymentMethod === 'mobile_money'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Mobile Money
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Card
                </label>
              </div>

              <button
                type="submit"
                className="btn-place-order"
                disabled={loading}
              >
                {loading
                  ? 'Placing Order...'
                  : `Place Order - ${formatPrice(cart.total)}`}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="order-summary-section">
            <h2>Order Summary</h2>

            {cart.items.map((item) => (
              <div key={item.id} className="summary-item">
                <div className="summary-item-image">
                  {item.product_image ? (
                    <img
                      src={getMediaUrl(item.product_image)}
                      alt={item.product_name}
                    />
                  ) : (
                    <div className="no-image">📦</div>
                  )}
                </div>

                <div className="summary-item-details">
                  <h4>{item.product_name}</h4>
                  <p>
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>

                <div className="summary-item-total">
                  {formatPrice(item.subtotal)}
                </div>
              </div>
            ))}

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>

              {cart.discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-{formatPrice(cart.discount)}</span>
                </div>
              )}

              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
