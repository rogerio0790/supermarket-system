import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import api from '../../api/axios';
import './RelatedProducts.css';

function RelatedProducts({ categoryId, currentProductId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedProducts();
  }, [categoryId]);

  const fetchRelatedProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`products/?category=${categoryId}`);
      const productData = response.data.results || response.data;
      // Filter out current product and limit to 4
      const filtered = productData
        .filter(p => p.id !== currentProductId)
        .slice(0, 4);
      setProducts(filtered);
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <div className="related-products-section">
      <h2>Related Products</h2>
      <div className="related-products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts;