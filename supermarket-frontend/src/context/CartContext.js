import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const fetchCart = async () => {
  try {
    setLoading(true);
    // First, ensure we have a CSRF token by making a GET request
    const response = await api.get('cart/');
    setCart(response.data);
  } catch (error) {
    console.error('Error fetching cart:', error);
    setCart(null);
  } finally {
    setLoading(false);
  }
};

  const addToCart = async (productId, quantity = 1) => {
  try {
    console.log('Adding to cart:', { product_id: productId, quantity });
    const response = await api.post('cart/add/', {
      product_id: productId,
      quantity: quantity,
    });
    console.log('Add to cart response:', response.data);
    await fetchCart();
    return { success: true };
  } catch (error) {
    console.error('Error adding to cart:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    return { success: false, error: error.response?.data };
  }
};

  const updateCartItem = async (itemId, quantity) => {
  try {
    await api.patch(`cart/items/${itemId}/update/`, { quantity });  // CHANGED - added /update/
    await fetchCart();
    return { success: true };
  } catch (error) {
    console.error('Error updating cart:', error);
    return { success: false, error: error.response?.data };
  }
};

const removeFromCart = async (itemId) => {
  try {
    await api.delete(`cart/items/${itemId}/remove/`);  // CHANGED - added /remove/
    await fetchCart();
    return { success: true };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, error: error.response?.data };
  }
};

  const clearCart = async () => {
    try {
      await api.post('cart/clear/');
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, error: error.response?.data };
    }
  };

  const cartItemsCount = cart?.items?.length || 0;
  const cartTotal = cart?.total || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartItemsCount,
        cartTotal,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);