from rest_framework import serializers
from .models import Payment
from orders.models import Order


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for payment"""
    
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id',
            'transaction_id',
            'order',
            'order_number',
            'user',
            'user_email',
            'payment_method',
            'phone_number',
            'amount',
            'status',
            'external_reference',
            'response_message',
            'created_at',
            'updated_at',
            'completed_at'
        ]
        read_only_fields = [
            'id',
            'transaction_id',
            'user',
            'status',
            'external_reference',
            'response_message',
            'created_at',
            'updated_at',
            'completed_at'
        ]


class InitiatePaymentSerializer(serializers.Serializer):
    """Serializer for initiating payment"""
    
    order_number = serializers.CharField()
    payment_method = serializers.ChoiceField(choices=Payment.PAYMENT_METHOD_CHOICES)
    phone_number = serializers.CharField(max_length=15)
    
    def validate_order_number(self, value):
        request = self.context.get('request')
        try:
            order = Order.objects.get(order_number=value, user=request.user)
        except Order.DoesNotExist:
            raise serializers.ValidationError("Order not found")
        
        if order.payment_status == 'PAID':
            raise serializers.ValidationError("Order already paid")
        
        if order.status == 'CANCELLED':
            raise serializers.ValidationError("Cannot pay for cancelled order")
        
        return value
    
    def validate_phone_number(self, value):
        # Basic phone number validation for Rwanda
        if not value.startswith('+250') and not value.startswith('250'):
            raise serializers.ValidationError("Phone number must be a valid Rwandan number")
        return value


class VerifyPaymentSerializer(serializers.Serializer):
    """Serializer for verifying payment (mock)"""
    
    transaction_id = serializers.CharField()