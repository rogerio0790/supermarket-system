import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import ProductCard from '../components/products/ProductCard';  // Should NOT have curly braces
import api from '../api/axios';
import './HomePage.css';
import heroImage from '../background.jpeg';
//import heroImage from '../background2.jpg';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
  try {
    setLoading(true);
    const response = await api.get('products/?is_featured=true');
    console.log('API Response:', response.data); // ADD THIS LINE
    console.log('First product:', response.data.results?.[0] || response.data[0]); // ADD THIS LINE
    setFeaturedProducts(response.data.results || response.data);
    setError(null);
  } catch (err) {
    console.error('Error fetching products:', err);
    setError('Failed to load products');
  } finally {
    setLoading(false);
  }
};
  

  return (
    <div className="home-page">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="weekend-badge"><i>We are hiring!</i></div>
            <h1 className="hero-title">
             WELCOME TO RUKARA SUPERMARKET<br />
              <span className="hero-title-highlight">Shop with us!</span>
            </h1>
            <p className="hero-description">
             Your one-stop shop for fresh foods, beverages, household essentials, and more at unbeatable prices.
             Shop with us for quality, affordability, and convenience!
            </p>
            <div className="hero-buttons">
              <button className="btn-shop-now">Shop Now</button>
              <button className="btn-learn-more">Learn More</button>
            </div>
            <div className="hero-features">
              <div className="feature-item">
                ⚡ 30-min delivery
              </div>
              <div className="feature-item">
                🚚 Free above 50,000 Rwf
              </div>
            </div>
          </div>

          <div className="hero-image">
            <img 
              src={heroImage}
              alt="Fresh produce" 
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Handpicked fresh items just for you</p>
          </div>

          {loading && (
            <div className="loading-state">
              <p>Loading products...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && featuredProducts.length === 0 && (
            <div className="empty-state">
              <p>No featured products available at the moment.</p>
            </div>
          )}

          {!loading && !error && featuredProducts.length > 0 && (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;