import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import ProductImageGallery from '../components/products/ProductImageGallery';
import ProductReviews from '../components/products/ProductReviews';
import RelatedProducts from '../components/products/RelatedProducts';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import api from '../api/axios';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { openAuthModal } = useModal();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiDescription, setAiDescription] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`products/${id}/`);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (action) => {
    if (action === 'increase' && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    const result = await addToCart(product.id, quantity);
    if (result.success) {
      alert('Added to cart successfully!');
      setQuantity(1);
    } else {
      alert('Failed to add to cart. Please try again.');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    const result = await addToCart(product.id, quantity);
    if (result.success) {
      navigate('/checkout');
    }
  };

  const handleGenerateAIDescription = async () => {
    setGeneratingAI(true);
    try {
      // TODO: Integrate OpenAI API here
      // For now, show placeholder
      setTimeout(() => {
        setAiDescription(`✨ AI-Generated Description:\n\n${product.name} is a premium quality product that delivers exceptional value. Perfect for daily use, this item combines superior craftsmanship with modern convenience. Customers love its reliability and performance. Stock up now while supplies last!`);
        setGeneratingAI(false);
      }, 2000);
    } catch (error) {
      console.error('AI generation error:', error);
      setGeneratingAI(false);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="error-container">
          <div className="error-icon">📦</div>
          <h2>Product Not Found</h2>
          <p>Sorry, we couldn't find the product you're looking for.</p>
          <button onClick={() => navigate('/products')} className="btn-back-home">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="product-detail-page">
        <Header />

        <div className="product-container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span onClick={() => navigate('/')}>Home</span>
            <span className="separator">/</span>
            <span onClick={() => navigate('/products')}>Products</span>
            <span className="separator">/</span>
            <span onClick={() => navigate(`/products?category=${product.category}`)}>
              {product.category_name}
            </span>
            <span className="separator">/</span>
            <span className="current">{product.name}</span>
          </div>

          {/* Main Product Section */}
          <div className="product-main">
            {/* Left: Image Gallery */}
            <div className="product-gallery-section">
              <ProductImageGallery 
                images={[product.image]} 
                productName={product.name}
              />
            </div>

            {/* Middle: Product Info */}
            <div className="product-info-section">
              <div className="product-brand">{product.category_name}</div>
              <h1 className="product-name">{product.name}</h1>
              
              {/* Rating */}
              <div className="product-rating">
                <div className="stars">
                  ⭐⭐⭐⭐⭐
                </div>
                <span className="rating-count">4.5 (128 reviews)</span>
              </div>

              {/* Price */}
              <div className="product-price-section">
                {product.discount_price ? (
                  <>
                    <div className="price-main">
                      <span className="currency">RWF</span>
                      <span className="amount">{formatPrice(product.discount_price).replace('RWF', '').trim()}</span>
                    </div>
                    <div className="price-original">
                      Was: <span>{formatPrice(product.price)}</span>
                    </div>
                    <div className="price-savings">
                      You save: {formatPrice(product.price - product.discount_price)} ({product.discount_percentage}%)
                    </div>
                  </>
                ) : (
                  <div className="price-main">
                    <span className="currency">RWF</span>
                    <span className="amount">{formatPrice(product.price).replace('RWF', '').trim()}</span>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="stock-info">
                {product.is_in_stock ? (
                  <div className="in-stock">
                    <span className="status-icon">✓</span>
                    <span>In Stock ({product.stock} available)</span>
                  </div>
                ) : (
                  <div className="out-of-stock">
                    <span className="status-icon">✗</span>
                    <span>Currently Unavailable</span>
                  </div>
                )}
              </div>

              {/* AI Description Button */}
              <div className="ai-section">
                <button 
                  onClick={handleGenerateAIDescription}
                  className="btn-ai-generate"
                  disabled={generatingAI}
                >
                  {generatingAI ? (
                    <>
                      <span className="ai-loader">🤖</span>
                      Generating AI Description...
                    </>
                  ) : (
                    <>
                      <span className="ai-icon">✨</span>
                      Generate AI Product Description
                    </>
                  )}
                </button>
                
                {aiDescription && (
                  <div className="ai-description">
                    <div className="ai-badge">AI-Powered</div>
                    <p>{aiDescription}</p>
                  </div>
                )}
              </div>

              {/* Product Highlights */}
              <div className="product-highlights">
                <h3>Product Highlights</h3>
                <ul>
                  <li>Premium quality {product.category_name.toLowerCase()}</li>
                  <li>Fresh and carefully selected</li>
                  <li>Same-day delivery available</li>
                  <li>100% satisfaction guaranteed</li>
                </ul>
              </div>

              {/* Product Details */}
              <div className="product-details-table">
                <h3>Product Details</h3>
                <table>
                  <tbody>
                    <tr>
                      <td>Category</td>
                      <td>{product.category_name}</td>
                    </tr>
                    <tr>
                      <td>Unit</td>
                      <td>{product.unit}</td>
                    </tr>
                    <tr>
                      <td>Stock</td>
                      <td>{product.stock} units available</td>
                    </tr>
                    {product.discount_percentage > 0 && (
                      <tr>
                        <td>Discount</td>
                        <td className="discount-highlight">{product.discount_percentage}% OFF</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Purchase Box */}
            <div className="product-purchase-section">
              <div className="purchase-box">
                <div className="purchase-price">
                  {formatPrice(product.discount_price || product.price)}
                </div>

                <div className="delivery-info">
                  <div className="delivery-item">
                    <span className="icon">🚚</span>
                    <div>
                      <strong>FREE Delivery</strong>
                      <p>On orders over RWF 50,000</p>
                    </div>
                  </div>
                  <div className="delivery-item">
                    <span className="icon">⚡</span>
                    <div>
                      <strong>Fast Delivery</strong>
                      <p>Within 30 minutes</p>
                    </div>
                  </div>
                </div>

                {product.is_in_stock && (
                  <>
                    {/* Quantity Selector */}
                    <div className="quantity-selector">
                      <label>Quantity:</label>
                      <div className="quantity-controls">
                        <button 
                          onClick={() => handleQuantityChange('decrease')}
                          disabled={quantity <= 1}
                        >
                          −
                        </button>
                        <input type="text" value={quantity} readOnly />
                        <button 
                          onClick={() => handleQuantityChange('increase')}
                          disabled={quantity >= product.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="purchase-actions">
                      <button 
                        onClick={handleAddToCart}
                        className="btn-add-to-cart"
                      >
                        🛒 Add to Cart
                      </button>
                      <button 
                        onClick={handleBuyNow}
                        className="btn-buy-now"
                      >
                        Buy Now
                      </button>
                    </div>
                  </>
                )}

                {!product.is_in_stock && (
                  <div className="out-of-stock-notice">
                    <p>This item is currently out of stock</p>
                    <button className="btn-notify">Notify When Available</button>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="trust-badges">
                  <div className="badge">
                    <span>🔒</span>
                    <span>Secure Payment</span>
                  </div>
                  <div className="badge">
                    <span>↩️</span>
                    <span>Easy Returns</span>
                  </div>
                  <div className="badge">
                    <span>✓</span>
                    <span>Quality Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <ProductReviews productId={product.id} />

          {/* Related Products */}
          <RelatedProducts 
            categoryId={product.category} 
            currentProductId={product.id}
          />
        </div>
      </div>
    </>
  );
}

export default ProductDetailPage;
