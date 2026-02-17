import React from 'react';
import './Skeleton.css';

export const Skeleton = ({ width, height, borderRadius = '4px', className = '' }) => {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius: borderRadius
      }}
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <Skeleton height="150px" borderRadius="8px 8px 0 0" />
      <div className="skeleton-card-body">
        <Skeleton height="20px" width="80%" />
        <Skeleton height="16px" width="60%" />
        <Skeleton height="24px" width="40%" />
      </div>
    </div>
  );
};

export const SkeletonCategoryCard = () => {
  return (
    <div className="skeleton-category-card">
      <Skeleton height="100px" borderRadius="8px" />
      <div className="skeleton-category-body">
        <Skeleton height="18px" width="70%" />
        <Skeleton height="14px" width="50%" />
      </div>
    </div>
  );
};

export const SkeletonText = ({ lines = 3 }) => {
  return (
    <div className="skeleton-text">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index} 
          height="16px" 
          width={index === lines - 1 ? '60%' : '100%'} 
        />
      ))}
    </div>
  );
};

export default Skeleton;
