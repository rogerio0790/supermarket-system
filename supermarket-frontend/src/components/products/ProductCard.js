import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice, getMediaUrl } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const imageUrl = getMediaUrl(product.image);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { openAuthModal } = useModal();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation to product detail
    e.stopPropagation(); // Stop event bubbling
    
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (!product.is_in_stock) {
      alert('This product is out of stock');
      return;
    }

    const result = await addToCart(product.id, 1);
    
    if (result.success) {
      // Optional: Show a small toast or feedback instead of alert
      alert('Product added to cart!');
    } else {
      alert('Failed to add to cart. Please try again.');
    }
  };

  return (
    <Link to={`/product/${product.slug}`} className="product-card">  {/* Changed from product.id to product.slug */}
      <div className="product-image">
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} />
        ) : (
          <div className="no-image">📦</div>
        )}
        {!product.is_in_stock && (
          <div className="out-of-stock-badge">Out of Stock</div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category_name}</p>
        
        <div className="product-footer">
          <div className="product-price">
            {product.discount_price ? (
              <>
                <span className="original-price">{formatPrice(product.price)}</span>
                <span className="discount-price">{formatPrice(product.discount_price)}</span>
              </>
            ) : (
              <span className="current-price">{formatPrice(product.price)}</span>
            )}
          </div>

          <button 
            className="add-to-cart-btn"
            disabled={!product.is_in_stock}
            onClick={handleAddToCart}
          >
            {product.is_in_stock ? '+ Add' : 'Unavailable'}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;