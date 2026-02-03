from django.urls import path
from .views import (
    CategoryListView,
    CategoryDetailView,
    ProductListView,
    ProductDetailView,
    FeaturedProductListView,
    CategoryProductListView
)

app_name = 'products'

urlpatterns = [
    # Categories
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/<slug:slug>/', CategoryDetailView.as_view(), name='category-detail'),
    
    # Products
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/featured/', FeaturedProductListView.as_view(), name='featured-products'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),
    
    # Products by category
    path('categories/<slug:category_slug>/products/', CategoryProductListView.as_view(), name='category-products'),
]