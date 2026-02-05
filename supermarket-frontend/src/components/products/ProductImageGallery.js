import React, { useState } from 'react';
import { getMediaUrl } from '../../utils/helpers';
import './ProductImageGallery.css';

function ProductImageGallery({ images, productName }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Convert single image to array if needed
  const imageArray = Array.isArray(images) ? images : [images];
  const fullImages = imageArray.map(img => getMediaUrl(img));

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  return (
    <div className="image-gallery">
      {/* Main Image */}
      <div 
        className={`main-image-container ${isZoomed ? 'zoomed' : ''}`}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img 
          src={fullImages[selectedImage] || '/placeholder.png'} 
          alt={productName}
          className="main-image"
          style={isZoomed ? {
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
          } : {}}
        />
        {isZoomed && (
          <div className="zoom-hint">
            Move mouse to zoom • Click to view fullscreen
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {imageArray.length > 1 && (
        <div className="thumbnail-gallery">
          {imageArray.map((img, index) => (
            <div
              key={index}
              className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
              onClick={() => setSelectedImage(index)}
            >
              <img src={getMediaUrl(img)} alt={`${productName} ${index + 1}`} />
            </div>
          ))}
        </div>
      )}

      {/* 3D Rotation Placeholder */}
      <div className="view-options">
        <button className="view-360" disabled>
          <span className="icon">🔄</span>
          360° View (Coming Soon)
        </button>
      </div>
    </div>
  );
}

export default ProductImageGallery;