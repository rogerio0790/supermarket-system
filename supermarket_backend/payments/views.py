from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from .models import Payment
from orders.models import Order
from .serializers import (
    PaymentSerializer,
    InitiatePaymentSerializer,
    VerifyPaymentSerializer
)
from notifications.services import SMSService
import random


class PaymentListView(generics.ListAPIView):
    """List all payments for current user"""
    
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class PaymentDetailView(generics.RetrieveAPIView):
    """Get payment details"""
    
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'transaction_id'
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class InitiatePaymentView(APIView):
    """Initiate payment for an order"""
    
    permission_classes = [IsAuthenticated]
    
    @transaction.atomic
    def post(self, request):
        serializer = InitiatePaymentSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        # Get order
        order = get_object_or_404(
            Order,
            order_number=serializer.validated_data['order_number'],
            user=request.user
        )
        
        # Create payment
        payment = Payment.objects.create(
            order=order,
            user=request.user,
            payment_method=serializer.validated_data['payment_method'],
            phone_number=serializer.validated_data['phone_number'],
            amount=order.total,
            status='PROCESSING'
        )
        
        # MOCK: Simulate payment provider response
        # In production, you would call MTN/Airtel API here
        mock_external_ref = f"EXT-{random.randint(100000, 999999)}"
        payment.external_reference = mock_external_ref
        payment.response_message = f"Payment request sent to {serializer.validated_data['phone_number']}. Please approve on your phone."
        payment.save()
        
        return Response({
            'payment': PaymentSerializer(payment).data,
            'message': 'Payment initiated. Please check your phone to approve the transaction.'
        }, status=status.HTTP_201_CREATED)


class VerifyPaymentView(APIView):
    """Verify payment status (mock)"""
    
    permission_classes = [IsAuthenticated]
    
    @transaction.atomic
    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get payment
        payment = get_object_or_404(
            Payment,
            transaction_id=serializer.validated_data['transaction_id'],
            user=request.user
        )
        
        if payment.status == 'SUCCESS':
            return Response({
                'payment': PaymentSerializer(payment).data,
                'message': 'Payment already completed'
            }, status=status.HTTP_200_OK)
        
        # MOCK: Simulate payment verification
        # In production, you would call MTN/Airtel verification API
        # For demo, randomly succeed or fail
        is_success = random.choice([True, True, True, False])  # 75% success rate
        
        if is_success:
            payment.status = 'SUCCESS'
            payment.completed_at = timezone.now()
            payment.response_message = 'Payment completed successfully'
            payment.save()
            
            # Update order payment status
            order = payment.order
            order.payment_status = 'PAID'
            order.status = 'PROCESSING'
            order.save()
            
            # Send payment confirmation SMS
            SMSService.send_payment_confirmation(
                phone_number=order.phone_number,
                order_number=order.order_number,
                amount=payment.amount,
                user=request.user
            )
            
            return Response({
                'payment': PaymentSerializer(payment).data,
                'message': 'Payment successful!'
            }, status=status.HTTP_200_OK)
        else:
            payment.status = 'FAILED'
            payment.response_message = 'Payment failed. Please try again.'
            payment.save()
            
            return Response({
                'payment': PaymentSerializer(payment).data,
                'message': 'Payment failed. Please try again.'
            }, status=status.HTTP_400_BAD_REQUEST)


class CancelPaymentView(APIView):
    """Cancel a pending payment"""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request, transaction_id):
        payment = get_object_or_404(
            Payment,
            transaction_id=transaction_id,
            user=request.user
        )
        
        if payment.status not in ['PENDING', 'PROCESSING']:
            return Response(
                {'error': 'Only pending/processing payments can be cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        payment.status = 'CANCELLED'
        payment.response_message = 'Payment cancelled by user'
        payment.save()
        
        return Response(
            PaymentSerializer(payment).data,
            status=status.HTTP_200_OK
        )