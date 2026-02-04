import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import { formatPrice, getMediaUrl } from '../utils/helpers';
import api from '../api/axios';
import { useCart } from '../context/CartContext'; // <-- import useCart
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams(); // Changed from slug to id as per App.js route
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });

  const { addToCart: addToCartContext } = useCart();

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      // Fetching by ID as per the route /product/:id
      const response = await api.get(`products/${id}/`);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const handleMouseLeave = () => {
    setZoomPos({ ...zoomPos, show: false });
  };

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

  // For multiple images, we'll use the main image and some placeholders since the model only has one.
  // In a real app, product.images would be an array.
  const productImages = product.image ? [product.image, product.image, product.image] : [];

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
            <div 
              className="main-image-container"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {productImages.length > 0 ? (
                <img 
                  src={getMediaUrl(productImages[activeImage])} 
                  alt={product.name} 
                  className="main-image"
                />
              ) : (
                <div className="no-image">📦</div>
              )}
              
              {zoomPos.show && (
                <div 
                  className="zoom-result"
                  style={{
                    backgroundImage: `url(${getMediaUrl(productImages[activeImage])})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`
                  }}
                />
              )}
            </div>
            
            <div className="image-thumbnails">
              {productImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`thumbnail ${activeImage === idx ? 'active' : ''}`}
                  onClick={() => setActiveImage(idx)}
                >
                  <img src={getMediaUrl(img)} alt={`${product.name} view ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="product-info-section">
            <div className="product-header">
              <div className="product-category-badge">{product.category_name}</div>
              <h1 className="product-title">{product.name}</h1>
              <p className="product-sku">SKU: {product.sku || 'N/A'}</p>
            </div>

            <div className="product-pricing-card">
              <div className="price-label">Price:</div>
              <div className="product-pricing">
                {product.discount_price ? (
                  <>
                    <div className="price-group">
                      <span className="discount-price">{formatPrice(product.discount_price)}</span>
                      <span className="original-price">{formatPrice(product.price)}</span>
                    </div>
                    <span className="discount-badge">-{product.discount_percentage}% OFF</span>
                  </>
                ) : (
                  <span className="current-price">{formatPrice(product.price)}</span>
                )}
              </div>
              <div className="unit-info">Price per {product.unit || 'piece'}</div>
            </div>

            <div className="stock-info">
              <div className={`stock-status-badge ${product.is_in_stock ? 'in-stock' : 'out-of-stock'}`}>
                {product.is_in_stock ? 'In Stock' : 'Out of Stock'}
              </div>
              {product.is_in_stock && (
                <span className="stock-count">{product.stock} units available</span>
              )}
            </div>

            <div className="specifications-section">
              <h3>Specifications</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Category</span>
                  <span className="spec-value">{product.category_name}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Unit</span>
                  <span className="spec-value">{product.unit}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Status</span>
                  <span className="spec-value">{product.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>

            <div className="purchase-section">
              {product.is_in_stock && (
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button 
                      className="qty-btn" 
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity <= 1}
                    >-</button>
                    <input 
                      type="number" 
                      className="qty-input" 
                      value={quantity} 
                      readOnly 
                    />
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
                  {product.is_in_stock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button className="btn-buy-now" disabled={!product.is_in_stock}>
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="product-extra-info">
          <div className="info-tabs">
            <button className="tab active">Product Description</button>
          </div>
          <div className="tab-panel">
            <div className="description-content">
              {product.description || 'No description available for this product.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
