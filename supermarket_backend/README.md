# Supermarket E-commerce Backend API

A full-featured e-commerce backend API built with Django and Django REST Framework for a supermarket system.

## Features

- **User Authentication**: Customer and Admin user types with JWT-style session authentication
- **Product Management**: Categories and products with images, pricing, and stock management
- **Shopping Cart**: Add, update, remove items with stock validation
- **Order Management**: Place orders, track status, cancel orders
- **Payment Integration**: Mock Mobile Money (MTN/Airtel) payment system
- **Admin Panel**: Full Django admin interface for managing all resources
- **RESTful APIs**: Clean, well-documented REST APIs for frontend consumption

## Tech Stack

- **Backend Framework**: Django 4.2.9
- **API Framework**: Django REST Framework 3.14.0
- **Database**: SQLite (development), PostgreSQL (production)
- **Image Processing**: Pillow
- **CORS**: django-cors-headers
- **Filtering**: django-filter

## Project Structure
```
supermarket_backend/
├── config/              # Project configuration
├── accounts/            # User authentication and management
├── products/            # Product catalog (categories, products)
├── cart/                # Shopping cart functionality
├── orders/              # Order management
├── payments/            # Payment processing
├── media/               # User uploaded files (product images)
├── staticfiles/         # Static files (CSS, JS)
├── logs/                # Application logs
├── manage.py
└── requirements.txt
```

## Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd supermarket_backend
```

### 2. Create virtual environment
```bash
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment variables

Create a `.env` file in the root directory:
```bash
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 5. Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create superuser
```bash
python manage.py createsuperuser
```

**Important**: After creating the superuser, go to Django admin and set `user_type` to `ADMIN`.

### 7. Run development server
```bash
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/`

## API Endpoints

### Authentication (`/api/auth/`)
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/profile/` - Get user profile
- `PUT/PATCH /api/auth/profile/update/` - Update profile
- `POST /api/auth/change-password/` - Change password

### Products (`/api/`)
- `GET /api/categories/` - List categories
- `GET /api/categories/<slug>/` - Category details
- `GET /api/products/` - List products (with filtering, search)
- `GET /api/products/<slug>/` - Product details
- `GET /api/products/featured/` - Featured products
- `GET /api/categories/<slug>/products/` - Products by category

### Cart (`/api/cart/`)
- `GET /api/cart/` - View cart
- `POST /api/cart/add/` - Add item to cart
- `PATCH /api/cart/items/<id>/update/` - Update item quantity
- `DELETE /api/cart/items/<id>/remove/` - Remove item
- `DELETE /api/cart/clear/` - Clear cart

### Orders (`/api/orders/`)
- `GET /api/orders/` - List user's orders
- `POST /api/orders/create/` - Create order from cart
- `GET /api/orders/<order_number>/` - Order details
- `POST /api/orders/<order_number>/cancel/` - Cancel order

### Payments (`/api/payments/`)
- `GET /api/payments/` - List user's payments
- `POST /api/payments/initiate/` - Initiate payment
- `POST /api/payments/verify/` - Verify payment
- `GET /api/payments/<transaction_id>/` - Payment details
- `POST /api/payments/<transaction_id>/cancel/` - Cancel payment

### Admin Endpoints
- `GET /api/auth/admin/users/` - List all users (admin only)
- `GET /api/orders/admin/all/` - List all orders (admin only)
- `PATCH /api/orders/admin/<order_number>/update-status/` - Update order status (admin only)

## Usage Examples

### Register a user
```bash
POST /api/auth/register/
{
    "email": "customer@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+250788123456",
    "password": "SecurePass123!",
    "password2": "SecurePass123!",
    "address": "KN 5 Ave",
    "city": "Kigali"
}
```

### Add to cart
```bash
POST /api/cart/add/
{
    "product_id": 1,
    "quantity": 2
}
```

### Create order
```bash
POST /api/orders/create/
{
    "delivery_address": "KN 5 Ave, Nyarugenge",
    "delivery_city": "Kigali",
    "phone_number": "+250788123456",
    "delivery_fee": 2000,
    "notes": "Please call before delivery"
}
```

### Initiate payment
```bash
POST /api/payments/initiate/
{
    "order_number": "ORD-A1B2C3D4",
    "payment_method": "MTN",
    "phone_number": "+250788123456"
}
```

## Admin Panel

Access the Django admin panel at `http://127.0.0.1:8000/admin/`

You can manage:
- Users
- Categories
- Products
- Orders
- Payments
- Cart items

## Production Deployment

### PostgreSQL Setup

1. Install PostgreSQL
2. Create database:
```bash
createdb supermarket_db
```

3. Update `.env`:
```bash
DEBUG=False
DB_ENGINE=django.db.backends.postgresql
DB_NAME=supermarket_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

### Collect Static Files
```bash
python manage.py collectstatic
```

### Security Checklist

- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Set `DEBUG=False`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Use PostgreSQL instead of SQLite
- [ ] Set up SSL/HTTPS
- [ ] Configure proper CORS settings
- [ ] Set up email backend for notifications
- [ ] Enable security middleware settings
- [ ] Set up proper logging
- [ ] Configure firewall rules

## Testing

Use Postman, Insomnia, or curl to test the API endpoints.

Or use the browsable API at `http://127.0.0.1:8000/api/`

## Future Enhancements

- [ ] JWT token authentication
- [ ] Real Mobile Money integration (MTN, Airtel)
- [ ] Email notifications
- [ ] Password reset functionality
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Inventory alerts
- [ ] Sales reports and analytics
- [ ] Discount codes/coupons
- [ ] Multi-image support for products

## License

MIT

## Support

For issues and questions, please create an issue in the repository.