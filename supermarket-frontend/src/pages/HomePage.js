import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import ProductCard from '../components/products/ProductCard';
import CategoryCard from '../components/products/CategoryCard';
import { SkeletonCard, SkeletonCategoryCard } from '../components/common/Skeleton';
import api from '../api/axios';
import './HomePage.css';
//import heroImage from '../background.jpeg';
import heroImage from '../background2.jpg';
import { FiZap, FiTruck } from 'react-icons/fi';


function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('products/?is_featured=true'),
          api.get('categories/')
        ]);
        
        setFeaturedProducts(productsRes.data.results || productsRes.data);
        setCategories(categoriesRes.data.results || categoriesRes.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
              <span className="hero-title-highlight">Musanze's Premier Marketplace</span>
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
                <FiZap size={18} /> 30-min delivery
              </div>
              <div className="feature-item">
                <FiTruck size={18} /> Free above 50,000 Rwf
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
            <div className="products-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
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

      {/* Shop by Category Section */}
      <section className="categories-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Explore our wide range of premium products by department</p>
          </div>

          {loading && (
            <div className="loading-state">
              <p>Loading categories...</p>
            </div>
          )}

          {!loading && !error && categories.length > 0 && (
            <div className="categories-grid">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
