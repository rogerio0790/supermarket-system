import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: 'login', // 'login', 'register', 'otp', 'success'
  });

  const [orderModal, setOrderModal] = useState({
    isOpen: false,
    order: null,
  });

  const openAuthModal = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ ...authModal, isOpen: false });
  };

  const openOrderModal = (order) => {
    setOrderModal({ isOpen: true, order });
  };

  const closeOrderModal = () => {
    setOrderModal({ isOpen: false, order: null });
  };

  return (
    <ModalContext.Provider
      value={{
        authModal,
        openAuthModal,
        closeAuthModal,
        orderModal,
        openOrderModal,
        closeOrderModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
