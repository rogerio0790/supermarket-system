import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import ProductCard from '../components/products/ProductCard';
import api from '../api/axios';
import './ProductListPage.css';

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('categories/');
      const categoryData = response.data.results || response.data;
      setCategories(Array.isArray(categoryData) ? categoryData : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = 'products/';
      const params = new URLSearchParams();

      // Only add category filter if it's not 'all' and is a valid number
      if (selectedCategory !== 'all' && !isNaN(selectedCategory)) {
        params.append('category', selectedCategory);
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await api.get(url);
      const productData = response.data.results || response.data;
      setProducts(Array.isArray(productData) ? productData : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="product-list-page">
      <Header />

      <div className="page-container">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <h3>Categories</h3>
          
          <div className="category-filters">
            <button
              className={`category-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              All Products
            </button>

            {Array.isArray(categories) && categories.map((category) => (
              <button
                key={category.id}
                className={`category-filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="products-main">
          {/* Search and Header */}
          <div className="products-header">
            <div>
              <h1>
                {selectedCategory === 'all' 
                  ? 'All Products' 
                  : categories.find(c => c.id === selectedCategory)?.name || 'Products'}
              </h1>
              <p>{products.length} products found</p>
            </div>

            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-state">
              <p>Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-state">
              <p>{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="empty-state">
              <p>No products found.</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ProductListPage;