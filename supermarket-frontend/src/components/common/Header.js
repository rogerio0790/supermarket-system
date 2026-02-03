import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-icon">🛒</span>
          <div className="logo-text">
            <h1>RUKARA SUPERMARKET</h1>
            <p>Fresh & Fast</p>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for products, brands and more..."
          />
          <button className="search-btn">🔍</button>
        </div>

        {/* Right Section */}
        <div className="header-right">
          {user ? (
            <>
              <Link to="/account" className="header-link">
                👤 Account
              </Link>
              <Link to="/cart" className="header-link cart-link">
                🛒 Cart
                {cartItemsCount > 0 && (
                  <span className="cart-badge">{cartItemsCount}</span>
                )}
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-link">
                Sign In
              </Link>
              <Link to="/register" className="btn-register">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Categories Navigation */}
      <nav className="categories-nav">
        <div className="categories-container">
          <Link to="/products?category=fresh-produce" className="category-item">
            🥬 Fresh Produce
          </Link>
          <Link to="/products?category=dairy-eggs" className="category-item">
            🥛 Dairy & Eggs
          </Link>
          <Link to="/products?category=meat-seafood" className="category-item">
            🥩 Meat & Seafood
          </Link>
          <Link to="/products?category=bakery" className="category-item">
            🍞 Bakery
          </Link>
          <Link to="/products?category=frozen-foods" className="category-item">
            ❄️ Frozen Foods
          </Link>
          <Link to="/products?category=beverages" className="category-item">
            🥤 Beverages
          </Link>
          <Link to="/products?category=snacks" className="category-item">
            🍿 Snacks
          </Link>
          <Link to="/products?category=health" className="category-item">
            💊 Health
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;