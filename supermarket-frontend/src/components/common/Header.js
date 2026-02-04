import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../api/axios';
import AuthModals from './AuthModals';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('categories/');
        const data = response.data.results || response.data;
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const isActive = (path) => {
    if (path === '/products') {
      return location.pathname === '/products' && !location.search;
    }
    return location.pathname + location.search === path;
  };

  return (
    <header className="site-header">
      {/* 1. Secondary Navbar (Top Bar) - Corporate Links */}
      <div className="top-bar">
        <div className="header-container">
          <nav className="corporate-nav">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About Us</Link>
            <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact Us</Link>
            <Link to="/careers" className={location.pathname === '/careers' ? 'active' : ''}>Careers</Link>
            <Link to="/help" className={location.pathname === '/help' ? 'active' : ''}>Help & FAQ</Link>
          </nav>
          <div className="top-bar-right">
            <span className="delivery-info">🚚 Free delivery on orders over $50</span>
          </div>
        </div>
      </div>

      {/* 2. Main Header - Branding, Search, User Actions */}
      <div className="main-header">
        <div className="header-container">
          <Link to="/" className="logo">
            <div className="logo-icon-wrapper">
              <span className="logo-icon">🛒</span>
            </div>
            <div className="logo-text">
              <h1>RUKARA</h1>
              <p>PREMIUM MARKET</p>
            </div>
          </Link>

          <div className="search-bar-wrapper">
            <form className="search-bar" onSubmit={(e) => {
              e.preventDefault();
              const query = e.target.search.value;
              navigate(`/products?search=${query}`);
            }}>
              <input
                type="text"
                name="search"
                placeholder="Search for fresh produce, snacks, beverages..."
                autoComplete="off"
              />
              <button type="submit" className="search-btn">
                <span className="search-icon">🔍</span>
              </button>
            </form>
          </div>

          <div className="header-actions">
            {user ? (
              <>
                <Link to="/account" className="action-item">
                  <span className="action-icon">👤</span>
                  <span className="action-label">Account</span>
                </Link>
                <Link to="/cart" className="action-item cart-action">
                  <div className="cart-icon-wrapper">
                    <span className="action-icon">🛍️</span>
                    {cartItemsCount > 0 && (
                      <span className="cart-badge">{cartItemsCount}</span>
                    )}
                  </div>
                  <span className="action-label">Cart</span>
                </Link>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => openAuthModal('login')} className="btn-login">
                  Sign In
                </button>
                <button onClick={() => openAuthModal('register')} className="btn-signup">
                  Join Now
                </button>
                <Link to="/cart" className="action-item cart-action">
                  <div className="cart-icon-wrapper">
                    <span className="action-icon">🛍️</span>
                    {cartItemsCount > 0 && (
                      <span className="cart-badge">{cartItemsCount}</span>
                    )}
                  </div>
                </Link>
              </>
            )}
            <button 
              className="mobile-menu-toggle" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="hamburger"></span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Category Menu - Product Categories ONLY */}
      <nav className={`category-nav-wrapper ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="header-container">
          <ul className="category-menu">
            <li className="category-item-all">
              <Link to="/products" className={isActive('/products') ? 'active' : ''}>
                <span className="all-icon">☰</span> All Departments
              </Link>
            </li>
            {categories.map((category) => {
              const path = `/products?category=${category.id}`;
              return (
                <li key={category.id}>
                  <Link 
                    to={path} 
                    className={isActive(path) ? 'active' : ''}
                  >
                    {category.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <AuthModals 
        isOpen={isAuthModalOpen} 
        initialMode={authMode} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </header>
  );
}

export default Header;
