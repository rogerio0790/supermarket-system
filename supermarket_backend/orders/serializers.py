from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items"""
    
    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product',
            'product_name',
            'product_price',
            'quantity',
            'total_price'
        ]


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for order list and detail"""
    
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'user',
            'user_email',
            'user_name',
            'status',
            'status_display',
            'payment_status',
            'payment_status_display',
            'payment_method',
            'payment_method_display',
            'delivery_address',
            'delivery_city',
            'phone_number',
            'subtotal',
            'delivery_fee',
            'total',
            'total_items',
            'notes',
            'items',
            'created_at',
            'updated_at',
            'delivered_at'
        ]
        read_only_fields = [
            'id',
            'order_number',
            'user',
            'subtotal',
            'total',
            'created_at',
            'updated_at'
        ]


class CreateOrderSerializer(serializers.Serializer):
    """Serializer for creating an order"""
    
    delivery_address = serializers.CharField(max_length=500)
    delivery_city = serializers.CharField(max_length=100)
    phone_number = serializers.CharField(max_length=15)
    delivery_fee = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_method = serializers.CharField(max_length=50, required=False)
    notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, attrs):
        request = self.context.get('request')
        
        # Check if user has a cart with items
        if not hasattr(request.user, 'cart'):
            raise serializers.ValidationError("Cart is empty")
        
        cart = request.user.cart
        if not cart.items.exists():
            raise serializers.ValidationError("Cart is empty")
        
        # Validate stock for all items
        for item in cart.items.all():
            if item.quantity > item.product.stock:
                raise serializers.ValidationError(
                    f"Insufficient stock for {item.product.name}. Only {item.product.stock} available."
                )
            if not item.product.is_active:
                raise serializers.ValidationError(
                    f"Product {item.product.name} is no longer available."
                )
        
        return attrs


class UpdateOrderStatusSerializer(serializers.Serializer):
    """Serializer for updating order status (admin only)"""
    
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES)
    payment_status = serializers.ChoiceField(choices=Order.PAYMENT_STATUS_CHOICES, required=False)