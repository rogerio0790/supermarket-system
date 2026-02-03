import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import { formatPrice, getMediaUrl } from '../utils/helpers';
import api from '../api/axios';
import { useCart } from '../context/CartContext'; // <-- import useCart
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart: addToCartContext } = useCart(); // <-- useCart hook

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`products/${slug}/`);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      if (quantity < product.stock) setQuantity(quantity + 1);
    } else if (action === 'decrease') {
      if (quantity > 1) setQuantity(quantity - 1);
    }
  };

  // <-- REPLACE the old handleAddToCart with this one
  const handleAddToCart = async () => {
    const result = await addToCartContext(product.id, quantity);
    if (result.success) {
      alert('Product added to cart!');
      setQuantity(1); // Reset quantity
    } else {
      if (result.error?.error) {
        alert(result.error.error);
      } else {
        alert('Failed to add to cart. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="loading-container">
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="error-container">
          <p>{error || 'Product not found'}</p>
          <button onClick={() => navigate('/products')} className="btn-back">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = getMediaUrl(product.image);

  return (
    <div className="product-detail-page">
      <Header />

      <div className="detail-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
          <span className="breadcrumb-separator">/</span>
          <span onClick={() => navigate('/products')} className="breadcrumb-link">Products</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="product-detail-grid">
          <div className="product-image-section">
            <div className="main-image">
              {imageUrl ? <img src={imageUrl} alt={product.name} /> : <div className="no-image">📦</div>}
            </div>
          </div>

          <div className="product-info-section">
            <div className="product-category-badge">{product.category_name}</div>
            <h1 className="product-title">{product.name}</h1>

            <div className="product-pricing">
              {product.discount_price ? (
                <>
                  <span className="original-price">{formatPrice(product.price)}</span>
                  <span className="discount-price">{formatPrice(product.discount_price)}</span>
                  <span className="discount-badge">-{product.discount_percentage}%</span>
                </>
              ) : (
                <span className="current-price">{formatPrice(product.price)}</span>
              )}
            </div>

            <div className="stock-status">
              {product.is_in_stock ? (
                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">✗ Out of Stock</span>
              )}
            </div>

            {product.is_in_stock && (
              <div className="quantity-section">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    className="qty-btn" 
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                  >-</button>
                  <span className="qty-display">{quantity}</span>
                  <button 
                    className="qty-btn" 
                    onClick={() => handleQuantityChange('increase')}
                    disabled={quantity >= product.stock}
                  >+</button>
                </div>
              </div>
            )}

            <div className="action-buttons">
              <button 
                className="btn-add-to-cart"
                onClick={handleAddToCart}
                disabled={!product.is_in_stock}
              >
                {product.is_in_stock ? '🛒 Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            <div className="product-details">
              <h3>Product Details</h3>
              <ul>
                <li><strong>Category:</strong> {product.category_name}</li>
                <li><strong>Unit:</strong> {product.unit}</li>
                <li><strong>Stock:</strong> {product.stock} units</li>
                {product.discount_percentage > 0 && (
                  <li><strong>Discount:</strong> {product.discount_percentage}% off</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {product.description && (
          <div className="product-description-section">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;
