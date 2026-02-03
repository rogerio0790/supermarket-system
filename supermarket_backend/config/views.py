from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.reverse import reverse


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request, format=None):
    """
    API Root - Overview of all available endpoints
    """
    return Response({
        'message': 'Welcome to Supermarket E-commerce API',
        'version': '1.0',
        'endpoints': {
            'authentication': {
                'register': reverse('accounts:register', request=request, format=format),
                'login': reverse('accounts:login', request=request, format=format),
                'logout': reverse('accounts:logout', request=request, format=format),
                'profile': reverse('accounts:profile', request=request, format=format),
                'profile_update': reverse('accounts:profile-update', request=request, format=format),
                'change_password': reverse('accounts:change-password', request=request, format=format),
            },
            'products': {
                'categories': reverse('products:category-list', request=request, format=format),
                'products': reverse('products:product-list', request=request, format=format),
                'featured_products': reverse('products:featured-products', request=request, format=format),
            },
            'cart': {
                'view_cart': reverse('cart:cart', request=request, format=format),
                'add_to_cart': reverse('cart:add-to-cart', request=request, format=format),
                'clear_cart': reverse('cart:clear-cart', request=request, format=format),
            },
            'orders': {
                'my_orders': reverse('orders:order-list', request=request, format=format),
                'create_order': reverse('orders:create-order', request=request, format=format),
            },
            'payments': {
                'my_payments': reverse('payments:payment-list', request=request, format=format),
                'initiate_payment': reverse('payments:initiate-payment', request=request, format=format),
                'verify_payment': reverse('payments:verify-payment', request=request, format=format),
            },
            'admin': {
                'all_users': reverse('accounts:admin-user-list', request=request, format=format),
                'all_orders': reverse('orders:admin-order-list', request=request, format=format),
            }
        }
    })