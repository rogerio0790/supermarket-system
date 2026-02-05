from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Order, OrderItem
from notifications.services import SMSService
from cart.models import Cart
from .serializers import (
    OrderSerializer,
    CreateOrderSerializer,
    UpdateOrderStatusSerializer
)


class OrderListView(generics.ListAPIView):
    """List all orders for the current user"""
    
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class OrderDetailView(generics.RetrieveAPIView):
    """Get order details"""
    
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'order_number'
    lookup_url_kwarg = 'order_number'
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class CreateOrderView(APIView):
    """Create order from cart"""
    
    permission_classes = [IsAuthenticated]
    
    @transaction.atomic
    def post(self, request):
        print(f"DEBUG: Order creation request from user {request.user.id}")
        print(f"DEBUG: Request data: {request.data}")
        
        serializer = CreateOrderSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            print(f"DEBUG: Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Get user's cart
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response(
                {'error': 'Cart not found'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cart_items = cart.items.all()
        if not cart_items.exists():
            return Response(
                {'error': 'Cart is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate totals
        from decimal import Decimal
        subtotal = Decimal('0.00')
        for item in cart_items:
            subtotal += Decimal(str(item.total_price))
            
        delivery_fee = Decimal(str(serializer.validated_data.get('delivery_fee', 0)))
        total = subtotal + delivery_fee
        
        # Create order
        try:
            order = Order.objects.create(
                user=request.user,
                delivery_address=serializer.validated_data['delivery_address'],
                delivery_city=serializer.validated_data['delivery_city'],
                phone_number=serializer.validated_data['phone_number'],
                subtotal=subtotal,
                delivery_fee=delivery_fee,
                total=total,
                notes=serializer.validated_data.get('notes', ''),
                payment_method=serializer.validated_data.get('payment_method', 'cash_on_delivery')
            )
        except Exception as e:
            print(f"DEBUG: Order creation failed: {str(e)}")
            return Response(
                {'error': f'Order creation failed: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create order items and update product stock
        for cart_item in cart_items:
            try:
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    product_name=cart_item.product.name,
                    product_price=Decimal(str(cart_item.product.final_price)),
                    quantity=cart_item.quantity
                )
            except Exception as e:
                print(f"DEBUG: OrderItem creation failed: {str(e)}")
                # Rollback will happen due to @transaction.atomic
                return Response(
                    {'error': f'Order item creation failed: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Reduce product stock
            product = cart_item.product
            product.stock -= cart_item.quantity
            product.save()
        
        # Clear cart
        cart.items.all().delete()
        
        # Send order confirmation SMS
        SMSService.send_order_confirmation(
            phone_number=order.phone_number,
            order_number=order.order_number,
            total=order.total,
            user=request.user
        )
        
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )


class CancelOrderView(APIView):
    """Cancel an order (only if pending)"""
    
    permission_classes = [IsAuthenticated]
    
    @transaction.atomic
    def post(self, request, order_number):
        order = get_object_or_404(
            Order,
            order_number=order_number,
            user=request.user
        )
        
        if order.status != 'PENDING':
            return Response(
                {'error': 'Only pending orders can be cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Restore product stock
        for item in order.items.all():
            if item.product:
                item.product.stock += item.quantity
                item.product.save()
        
        # Update order status
        order.status = 'CANCELLED'
        order.save()
        
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_200_OK
        )