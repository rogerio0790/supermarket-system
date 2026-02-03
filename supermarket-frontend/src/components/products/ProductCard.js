import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice, getMediaUrl } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const imageUrl = getMediaUrl(product.image);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
  e.preventDefault(); // Prevent navigation to product detail
  e.stopPropagation(); // Stop event bubbling
  
  console.log('Add to cart clicked for product:', product.id); // ADD THIS
  
  if (!user) {
    alert('Please login to add items to cart');
    navigate('/login');
    return;
  }

  if (!product.is_in_stock) {
    alert('This product is out of stock');
    return;
  }

  console.log('Calling addToCart...'); // ADD THIS
  const result = await addToCart(product.id, 1);
  console.log('AddToCart result:', result); // ADD THIS
  
  if (result.success) {
    alert('Product added to cart!');
  } else {
    console.error('Failed to add to cart:', result.error); // ADD THIS
    alert('Failed to add to cart. Please try again.');
  }
};
  return (
    <Link to={`/product/${product.id}`} className="product-card">
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