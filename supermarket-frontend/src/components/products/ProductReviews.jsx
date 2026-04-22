import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { FaStar, FaUserCircle } from 'react-icons/fa';

const ProductReviews = ({ slug }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');

  // FIX 1: wrap in useCallback so it's stable across renders
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError('');
      const response = await api.get(`/products/${slug}/reviews/`);
      setReviews(response.data.reviews || []);
      setAvgRating(response.data.avg_rating || 0);
      setReviewCount(response.data.review_count || 0);
    } catch (err) {
      console.error('Reviews fetch error:', err);
      // FIX 2: show meaningful error to user
      if (err.response?.status === 401) {
        setFetchError('Please log in to view reviews.');
      } else {
        setFetchError('Failed to load reviews. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]); // FIX 3: depend on the stable fetchReviews reference

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit a review.');
      return;
    }
    try {
      setSubmitting(true);
      setError('');
      await api.post(`/products/${slug}/reviews/`, {
        rating,
        comment: comment.trim()
      });
      setComment('');
      setRating(5);
      await fetchReviews();
    } catch (err) {
      console.error('Submit error:', err);
      // FIX 4: surface specific backend errors
      if (err.response?.status === 401) {
        setError('Please log in to submit a review.');
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to submit review. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // FIX 5: Math.round so float avgRating (e.g. 3.7) renders correct stars
  const renderStars = (currentRating, clickable = false) => (
    <>
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={i < Math.round(currentRating) ? 'filled' : 'empty'}
          onClick={clickable ? () => handleRatingClick(i + 1) : undefined}
          style={{ cursor: clickable ? 'pointer' : 'default' }}
        />
      ))}
    </>
  );

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  // FIX 6: show fetch error if reviews couldn't be loaded
  if (fetchError) {
    return <div className="error">{fetchError}</div>;
  }

  return (
    <div className="product-reviews">
      <div className="reviews-header">
        <h3>Reviews ({reviewCount})</h3>
        <div className="avg-rating">
          {renderStars(avgRating)}
          <span> {avgRating.toFixed(1)} / 5</span>
        </div>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="review-form">
          <h4>Write a Review</h4>
          <div className="rating-selector">
            <label>Rating:</label>
            {renderStars(rating, true)}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts (optional)..."
            rows={4}
          />
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      ) : (
        <div className="login-to-review">
          <p>Log in to write a review</p>
        </div>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <FaUserCircle />
                <div>
                  <div className="user-name">
                    {review.user_name || 'Anonymous'}
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                    <span>{review.rating}/5</span>
                  </div>
                  <div className="review-date">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {review.comment && <p className="review-text">{review.comment}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;