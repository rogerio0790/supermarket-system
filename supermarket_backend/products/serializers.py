from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    
    products_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'image',
            'is_active',
            'products_count',
            'created_at'
        ]
    
    def get_products_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for Product list view"""
    
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'category',
            'category_name',
            'image',
            'price',
            'discount_price',
            'final_price',
            'discount_percentage',
            'stock',
            'is_in_stock',
            'unit',
            'is_featured'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer for Product detail view"""
    
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'category',
            'category_name',
            'category_slug',
            'image',
            'price',
            'discount_price',
            'final_price',
            'discount_percentage',
            'stock',
            'is_in_stock',
            'unit',
            'sku',
            'is_featured',
            'created_at',
            'updated_at'
        ]