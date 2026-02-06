import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products?category=${category.id}`);
  };

  // Fallback images for common categories if the category doesn't have one
  const getFallbackImage = (name) => {
    const categoryName = name.toLowerCase();
    if (categoryName.includes('fruit') || categoryName.includes('vegetable')) {
      return 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=800';
    }
    if (categoryName.includes('beer') || categoryName.includes('alcohol') || categoryName.includes('beverage')) {
      return 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80&w=800';
    }
    if (categoryName.includes('bakery') || categoryName.includes('bread')) {
      return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800';
    }
    if (categoryName.includes('dairy') || categoryName.includes('milk')) {
      return 'https://images.unsplash.com/photo-1550583724-125581cc258b?auto=format&fit=crop&q=80&w=800';
    }
    if (categoryName.includes('cloth')) {
      return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800';
    }
    if (categoryName.includes('meat')) {
      return 'https://images.unsplash.com/photo-1607623273523-5998c75c10fa?auto=format&fit=crop&q=80&w=800';
    }
    // Default supermarket image
    return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800';
  };

  const imageUrl = category.image 
    ? (category.image.startsWith('http') ? category.image : `http://localhost:8000${category.image}`)
    : getFallbackImage(category.name);

  return (
    <div className="category-card" onClick={handleClick}>
      <div 
        className="category-card-bg" 
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="category-card-overlay">
        <h3 className="category-card-name">{category.name}</h3>
      </div>
    </div>
  );
};

export default CategoryCard;
