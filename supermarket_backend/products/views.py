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
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .ai_service import AIService

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_ai_description(request, slug):
    """Generate AI description for a product using Grok"""
    
    try:
        product = Product.objects.get(slug=slug, is_active=True)
        ai_service = AIService()
        
        ai_description = ai_service.generate_product_description(
            product_name=product.name,
            category=product.category.name,
            price=float(product.final_price),
            unit=product.unit,
            existing_description=product.description
        )
        
        if ai_description:
            if ai_description.startswith("ERROR_NO_CREDITS"):
                return Response({
                    'success': False,
                    'error': ai_description.split(": ")[1]
                }, status=status.HTTP_402_PAYMENT_REQUIRED)
                
            return Response({
                'success': True,
                'ai_description': ai_description,
                'product_name': product.name
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'error': 'Failed to generate description'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except Product.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Product not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
