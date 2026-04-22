import React from 'react';
import { FaExpand } from 'react-icons/fa';

const ProductImageGallery = ({ images = [], productName }) => {
  if (!images || images.length === 0) {
    return (
      <div className="image-gallery">
        <div className="placeholder-image">
          <span>No image available</span>
        </div>
      </div>
    );
  }

  const mainImage = images[0];

  return (
    <div className="image-gallery">
      <img 
        src={mainImage} 
        alt={productName} 
        className="main-image"
      />
      <div className="gallery-thumbnails">
        {images.map((img, index) => (
          <img 
            key={index}
            src={img} 
            alt={`${productName} ${index + 1}`}
            className="thumbnail"
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;

