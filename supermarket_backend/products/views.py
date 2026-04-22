from rest_framework import generics, filters
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404

from .models import Category, Product, Review
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ReviewSerializer
)
from .ai_service import AIService


# =========================
# CATEGORY VIEWS
# =========================

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


# =========================
# PRODUCT VIEWS
# =========================

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True).select_related('category')
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_featured']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True).select_related('category')
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class FeaturedProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True, is_featured=True).select_related('category')
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]


class CategoryProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        return Product.objects.filter(
            is_active=True,
            category__slug=category_slug,
            category__is_active=True
        ).select_related('category')


# =========================
# REVIEW VIEWS
# =========================

class ProductReviewsView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        product_slug = self.kwargs['slug']
        return Review.objects.filter(
            product__slug=product_slug
        ).select_related('user', 'product').order_by('-created_at')

    def perform_create(self, serializer):
        product_slug = self.kwargs['slug']
        product = get_object_or_404(Product, slug=product_slug, is_active=True)
        serializer.save(product=product, user=self.request.user)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        product_slug = self.kwargs['slug']
        product = get_object_or_404(Product, slug=product_slug)

        response.data = {
            'reviews': response.data.get('results', response.data),
            'avg_rating': float(product.avg_rating),
            'review_count': product.review_count
        }
        return response


# =========================
# AI DESCRIPTION VIEW
# =========================

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_ai_description(request, slug):
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