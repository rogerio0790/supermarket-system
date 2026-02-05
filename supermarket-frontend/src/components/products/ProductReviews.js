import React, { useState } from 'react';
import './ProductReviews.css';

function ProductReviews({ productId }) {
  const [reviews] = useState([
    {
      id: 1,
      author: 'John D.',
      rating: 5,
      date: '2 days ago',
      title: 'Excellent product!',
      comment: 'Great quality and fast delivery. Highly recommend!',
      helpful: 12
    },
    {
      id: 2,
      author: 'Sarah M.',
      rating: 4,
      date: '1 week ago',
      title: 'Good value for money',
      comment: 'Product is good but packaging could be better.',
      helpful: 5
    },
    {
      id: 3,
      author: 'Mike K.',
      rating: 5,
      date: '2 weeks ago',
      title: 'Fresh and high quality',
      comment: 'Always fresh products from this store. Will buy again!',
      helpful: 18
    }
  ]);

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="product-reviews-section">
      <h2>Customer Reviews</h2>
      
      {/* Rating Summary */}
      <div className="rating-summary">
        <div className="average-rating">
          <div className="rating-number">4.5</div>
          <div className="rating-stars">{renderStars(5)}</div>
          <div className="rating-count">Based on 128 reviews</div>
        </div>

        <div className="rating-bars">
          {[5, 4, 3, 2, 1].map(star => (
            <div key={star} className="rating-bar-row">
              <span className="star-label">{star} ⭐</span>
              <div className="rating-bar">
                <div 
                  className="rating-bar-fill" 
                  style={{width: `${star === 5 ? 70 : star === 4 ? 20 : 10}%`}}
                ></div>
              </div>
              <span className="rating-percentage">
                {star === 5 ? '70%' : star === 4 ? '20%' : '10%'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="review-author">
                <div className="author-avatar">{review.author[0]}</div>
                <div>
                  <div className="author-name">{review.author}</div>
                  <div className="review-date">{review.date}</div>
                </div>
              </div>
              <div className="review-rating">{renderStars(review.rating)}</div>
            </div>
            
            <h4 className="review-title">{review.title}</h4>
            <p className="review-comment">{review.comment}</p>
            
            <div className="review-footer">
              <button className="btn-helpful">
                👍 Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-write-review">Write a Review</button>
    </div>
  );
}

export default ProductReviews;