from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Order
from .serializers import OrderSerializer, UpdateOrderStatusSerializer
from accounts.permissions import IsAdminUser


class AdminOrderListView(generics.ListAPIView):
    """Admin view to list all orders"""
    
    queryset = Order.objects.all().prefetch_related('items')
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['status', 'payment_status']
    search_fields = ['order_number', 'user__email', 'user__first_name', 'user__last_name']
    ordering_fields = ['created_at', 'total']
    ordering = ['-created_at']


class AdminOrderDetailView(generics.RetrieveAPIView):
    """Admin view to get any order details"""
    
    queryset = Order.objects.all().prefetch_related('items')
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'order_number'


class AdminUpdateOrderStatusView(APIView):
    """Admin view to update order status"""
    
    permission_classes = [IsAdminUser]
    
    def patch(self, request, order_number):
        order = get_object_or_404(Order, order_number=order_number)
        
        serializer = UpdateOrderStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Update status
        if 'status' in serializer.validated_data:
            order.status = serializer.validated_data['status']
        
        if 'payment_status' in serializer.validated_data:
            order.payment_status = serializer.validated_data['payment_status']
        
        order.save()
        
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_200_OK
        )