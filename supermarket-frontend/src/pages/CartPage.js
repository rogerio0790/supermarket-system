import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, getMediaUrl } from '../utils/helpers';
import './CartPage.css';

function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loading, updateCartItem, removeFromCart, clearCart } = useCart();

  if (!user) {
    return (
      <div className="cart-page">
        <Header />
        <div className="empty-cart-container">
          <h2>Please Login</h2>
          <p>You need to be logged in to view your cart</p>
          <button onClick={() => navigate('/login')} className="btn-login">
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-page">
        <Header />
        <div className="loading-container">
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="cart-page">
        <Header />
        <div className="empty-cart-container">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <button onClick={() => navigate('/products')} className="btn-shop">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (itemId, currentQuantity, action) => {
    const newQuantity = action === 'increase' ? currentQuantity + 1 : currentQuantity - 1;
    if (newQuantity < 1) return;
    await updateCartItem(itemId, newQuantity);
  };

  const handleRemove = async (itemId) => {
    if (window.confirm('Remove this item from cart?')) {
      await removeFromCart(itemId);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Clear all items from cart?')) {
      await clearCart();
    }
  };

  return (
    <div className="cart-page">
      <Header />

      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button onClick={handleClearCart} className="btn-clear">
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image" onClick={() => navigate(`/product/${item.product?.slug}`)}>
                  {item.product?.image ? (
                    <img src={getMediaUrl(item.product.image)} alt={item.product?.name} />
                  ) : (
                    <div className="no-image">📦</div>
                  )}
                </div>

                <div className="item-details">
                  <h3 onClick={() => navigate(`/product/${item.product?.slug}`)}>{item.product?.name}</h3>
                  <p className="item-price">{formatPrice(item.product?.final_price)} per unit</p>
                </div>

                <div className="item-quantity">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity, 'decrease')}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, item.quantity, 'increase')}>
                    +
                  </button>
                </div>

                <div className="item-total">
                  <p className="total-price">{formatPrice(item.total_price)}</p>
                </div>

                <button className="btn-remove" onClick={() => handleRemove(item.id)}>
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            
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

            <button className="btn-checkout" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>

            <button className="btn-continue" onClick={() => navigate('/products')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
