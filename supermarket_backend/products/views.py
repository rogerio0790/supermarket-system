from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer
)


class CategoryListView(generics.ListAPIView):
    """List all active categories"""
    
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class CategoryDetailView(generics.RetrieveAPIView):
    """Retrieve a single category by slug"""
    
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class ProductListView(generics.ListAPIView):
    """List all active products with filtering and search"""
    
    queryset = Product.objects.filter(is_active=True).select_related('category')
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_featured']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']


class ProductDetailView(generics.RetrieveAPIView):
    """Retrieve a single product by slug"""
    
    queryset = Product.objects.filter(is_active=True).select_related('category')
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class FeaturedProductListView(generics.ListAPIView):
    """List featured products"""
    
    queryset = Product.objects.filter(is_active=True, is_featured=True).select_related('category')
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]


class CategoryProductListView(generics.ListAPIView):
    """List products by category slug"""
    
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        return Product.objects.filter(
            is_active=True,
            category__slug=category_slug,
            category__is_active=True
        ).select_related('category')