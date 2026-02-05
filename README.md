# Rukara Supermarket System

A comprehensive, full-stack supermarket management and e-commerce platform designed for premium retail experiences.

## 🚀 Project Overview

The Rukara Supermarket System is built with a modern technology stack to provide a seamless shopping experience for customers and efficient management for administrators. It features a robust Django-based backend and a responsive React frontend.

### Key Features

- **Product Management**: Categorized product listing with featured items and discount support.
- **Real-time Search**: Fast and intuitive product search functionality.
- **User Authentication**: Secure registration and login system with phone-based OTP verification.
- **Shopping Cart**: Fully functional cart with persistent state and real-time updates.
- **Order Management**: Streamlined checkout process and order confirmation.
- **AI-Powered Descriptions**: Integrated AI capabilities for generating product descriptions.
- **Theme Support**: Built-in Dark Mode and Light Mode for user preference.

## 🛠️ Technology Stack

### Frontend
- **React**: Modern component-based UI.
- **Context API**: Global state management for Auth, Cart, and Modals.
- **Axios**: Clean API communication.
- **CSS3**: Custom styling with theme support.

### Backend
- **Django**: Robust web framework.
- **Django REST Framework (DRF)**: Scalable API architecture.
- **SQLite/PostgreSQL**: Flexible database options.
- **OTP Integration**: Secure phone verification.

## 📦 Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.10+)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rogerio0790/supermarket-system.git
   cd supermarket-system
   ```

2. **Setup Backend**
   ```bash
   cd supermarket_backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. **Setup Frontend**
   ```bash
   cd ../supermarket-frontend
   npm install
   npm start
   ```

## 📄 License

This project is licensed under the MIT License.

---
Built with ❤️ by [Rogerio](https://github.com/rogerio0790)
