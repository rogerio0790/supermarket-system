from django.urls import path
from .views import (
    OrderListView,
    OrderDetailView,
    CreateOrderView,
    CancelOrderView
)
from .admin_views import (
    AdminOrderListView,
    AdminOrderDetailView,
    AdminUpdateOrderStatusView
)

app_name = 'orders'

urlpatterns = [
    # Customer endpoints
    path('', OrderListView.as_view(), name='order-list'),
    path('create/', CreateOrderView.as_view(), name='create-order'),
    path('<str:order_number>/', OrderDetailView.as_view(), name='order-detail'),
    path('<str:order_number>/cancel/', CancelOrderView.as_view(), name='cancel-order'),
    
    # Admin endpoints
    path('admin/all/', AdminOrderListView.as_view(), name='admin-order-list'),
    path('admin/<str:order_number>/', AdminOrderDetailView.as_view(), name='admin-order-detail'),
    path('admin/<str:order_number>/update-status/', AdminUpdateOrderStatusView.as_view(), name='admin-update-order-status'),
]