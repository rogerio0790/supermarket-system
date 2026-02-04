from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from products.models import Product
from .serializers import (
    CartSerializer,
    CartItemSerializer,
    AddToCartSerializer,
    UpdateCartItemSerializer
)


class CartView(generics.RetrieveAPIView):
    """Get current user's cart"""
    
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart


class AddToCartView(APIView):
    """Add item to cart"""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']
        
        # Get or create cart
        cart, created = Cart.objects.get_or_create(user=request.user)
        
        # Get product
        product = get_object_or_404(Product, id=product_id, is_active=True)
        
        # Check stock
        if quantity > product.stock:
            return Response(
                {'error': f'Only {product.stock} items available in stock'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if item already in cart
        cart_item, item_created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not item_created:
            # Update quantity if item already exists
            new_quantity = cart_item.quantity + quantity
            if new_quantity > product.stock:
                return Response(
                    {'error': f'Cannot add more. Only {product.stock} items available'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.quantity = new_quantity
            cart_item.save()
        
        return Response(
            CartSerializer(cart).data,
            status=status.HTTP_200_OK
        )


class UpdateCartItemView(APIView):
    """Update cart item quantity"""
    
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, item_id):
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        quantity = serializer.validated_data['quantity']
        
        # Get cart item
        cart_item = get_object_or_404(
            CartItem,
            id=item_id,
            cart__user=request.user
        )
        
        # Check stock
        if quantity > cart_item.product.stock:
            return Response(
                {'error': f'Only {cart_item.product.stock} items available in stock'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cart_item.quantity = quantity
        cart_item.save()
        
        return Response(
            CartSerializer(cart_item.cart).data,
            status=status.HTTP_200_OK
        )


class RemoveFromCartView(APIView):
    """Remove item from cart"""
    
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, item_id):
        cart_item = get_object_or_404(
            CartItem,
            id=item_id,
            cart__user=request.user
        )
        
        cart = cart_item.cart
        cart_item.delete()
        
        return Response(
            CartSerializer(cart).data,
            status=status.HTTP_200_OK
        )


class ClearCartView(APIView):
    """Clear all items from cart"""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        cart.items.all().delete()
        
        return Response(
            {'message': 'Cart cleared successfully'},
            status=status.HTTP_204_NO_CONTENT
        )
    
    def delete(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        cart.items.all().delete()
        
        return Response(
            {'message': 'Cart cleared successfully'},
            status=status.HTTP_204_NO_CONTENT
        )