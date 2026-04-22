from rest_framework import serializers
from .models import Category, Product, Review


class CategorySerializer(serializers.ModelSerializer):
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
    category_name = serializers.CharField(source='category.name', read_only=True)
    avg_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    
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
            'is_featured',
            'avg_rating',
            'review_count'
        ]
    
    def get_avg_rating(self, obj):
        return obj.avg_rating
    
    def get_review_count(self, obj):
        return obj.review_count


class ProductDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    avg_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    
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
            'avg_rating',
            'review_count',
            'created_at',
            'updated_at'
        ]
    
    def get_avg_rating(self, obj):
        return obj.avg_rating
    
    def get_review_count(self, obj):
        return obj.review_count


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    product_slug = serializers.CharField(source='product.slug', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id', 
            'rating', 
            'comment', 
            'user', 
            'user_name', 
            'product_slug', 
            'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']
    
    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.email
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

