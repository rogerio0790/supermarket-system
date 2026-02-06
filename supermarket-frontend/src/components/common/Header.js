import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useModal } from '../../context/ModalContext';
import api from '../../api/axios';
import {
  FiSearch,
  FiUser,
  FiShoppingBag,
  FiLogOut,
  FiSun,
  FiMoon,
  FiMenu
} from 'react-icons/fi';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const { openAuthModal } = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    document.body.classList.toggle('dark-theme', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

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

  const isActive = (path) => {
    if (path === '/products') {
      return (
        location.pathname === '/products' &&
        (!location.search || location.search === '?category=all')
      );
    }
    return location.pathname + location.search === path;
  };

  return (
    <header className="site-header">
      {/* TOP BAR */}
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
            <span className="delivery-info">
              Free delivery on orders over $50
            </span>
            <button
              className="theme-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle theme"
            >
              {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="main-header">
        <div className="header-container">
          <Link to="/" className="logo">
            <div className="logo-icon-wrapper">
              <FiShoppingBag size={28} />
            </div>
            <div className="logo-text">
              <h1>RUKARA</h1>
              <p>PREMIUM MARKET</p>
            </div>
          </Link>

          <div className="search-bar-wrapper">
            <form
              className="search-bar"
              onSubmit={(e) => {
                e.preventDefault();
                const query = e.target.search.value;
                navigate(`/products?search=${query}`);
              }}
            >
              <input
                type="text"
                name="search"
                placeholder="Search for fresh produce, snacks, beverages..."
                autoComplete="off"
              />
              <button type="submit" className="search-btn">
                <FiSearch size={18} />
              </button>
            </form>
          </div>

          <div className="header-actions">
            {user ? (
              <>
                <Link to="/account" className="action-item">
                  <FiUser size={20} />
                  <span className="action-label">Account</span>
                </Link>

                <Link to="/cart" className="action-item cart-action">
                  <div className="cart-icon-wrapper">
                    <FiShoppingBag size={20} />
                    {cartItemsCount > 0 && (
                      <span className="cart-badge">{cartItemsCount}</span>
                    )}
                  </div>
                  <span className="action-label">Cart</span>
                </Link>

                <button onClick={handleLogout} className="btn-logout">
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('login')}
                  className="btn-login"
                >
                  Sign In
                </button>

                <button
                  onClick={() => openAuthModal('register')}
                  className="btn-signup"
                >
                  Join Now
                </button>

                <Link to="/cart" className="action-item cart-action">
                  <div className="cart-icon-wrapper">
                    <FiShoppingBag size={20} />
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
              <FiMenu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORY NAV */}
      <nav className={`category-nav-wrapper ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="header-container">
          <ul className="category-menu">
            <li className="category-item-all">
              <Link
                to="/products?category=all"
                className={isActive('/products') ? 'active' : ''}
              >
                <FiMenu size={16} />
                <span>All Departments</span>
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
    </header>
  );
}

export default Header;
