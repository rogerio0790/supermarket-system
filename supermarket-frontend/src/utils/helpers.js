// Format price in RWF
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
  }).format(price);
};

// Prepend media URL - UPDATED
export const getMediaUrl = (path) => {
  if (!path) return null;
  
  // If path already includes http://, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Otherwise, prepend the base URL
  return `http://127.0.0.1:8000${path}`;
};