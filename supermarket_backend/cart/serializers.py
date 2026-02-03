from rest_framework import serializers
from .models import Cart, CartItem
from products.serializers import ProductListSerializer


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for cart items"""
    
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = CartItem
        fields = [
            'id',
            'product',
            'product_id',
            'quantity',
            'total_price',
            'added_at'
        ]
    
    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1")
        return value
    
    def validate(self, attrs):
        product_id = attrs.get('product_id')
        quantity = attrs.get('quantity', 1)
        
        from products.models import Product
        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found or inactive")
        
        if quantity > product.stock:
            raise serializers.ValidationError(
                f"Only {product.stock} items available in stock"
            )
        
        attrs['product'] = product
        return attrs


class CartSerializer(serializers.ModelSerializer):
    """Serializer for cart"""
    
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Cart
        fields = [
            'id',
            'items',
            'total_items',
            'subtotal',
            'total',
            'created_at',
            'updated_at'
        ]


class AddToCartSerializer(serializers.Serializer):
    """Serializer for adding items to cart"""
    
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(default=1, min_value=1)


class UpdateCartItemSerializer(serializers.Serializer):
    """Serializer for updating cart item quantity"""
    
    quantity = serializers.IntegerField(min_value=1)