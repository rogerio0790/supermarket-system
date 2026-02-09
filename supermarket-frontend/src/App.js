import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ModalProvider, useModal } from './context/ModalContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AccountPage from './pages/AccountPage';
import Footer from './components/common/Footer';
import AuthModals from './components/common/AuthModals';
import OrderConfirmationModal from './components/common/OrderConfirmationModal';

function AppContent() {
  const { authModal, closeAuthModal, orderModal, closeOrderModal } = useModal();
  return (
    <div className="App">
      <main style={{ minHeight: 'calc(100vh - 100px)' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </main>
      <Footer />
      
      <AuthModals 
        isOpen={authModal.isOpen} 
        initialMode={authModal.mode} 
        onClose={closeAuthModal} 
      />
      
      <OrderConfirmationModal 
        isOpen={orderModal.isOpen} 
        order={orderModal.order} 
        onClose={closeOrderModal} 
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ModalProvider>
          <Router>
            <AppContent />
          </Router>
        </ModalProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
