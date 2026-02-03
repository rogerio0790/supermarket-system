from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from notifications.models import OTP
from django.db import transaction  
from notifications.services import SMSService
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserSerializer,
    UserProfileUpdateSerializer,
    ChangePasswordSerializer
)
class UserRegistrationView(generics.CreateAPIView):
    """Register a new user"""
    
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    @transaction.atomic  # Add this decorator
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Set user as inactive until OTP is verified
        user.is_active = False
        user.save(update_fields=['is_active'])
        
        # Create OTP
        otp = OTP.objects.create(
            user=user,
            phone_number=user.phone_number,
            otp_type='REGISTRATION'
        )
        
        # Send OTP via SMS
        SMSService.send_otp(user.phone_number, otp.otp_code, user)
        
        print(f"📝 User registered: {user.email}, is_active={user.is_active}")  # Debug
        print(f"📱 OTP sent: {otp.otp_code}")  # Debug
        
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Registration successful! Please verify OTP sent to your phone.',
            'otp_sent': True,
            'phone_number': user.phone_number
        }, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    """Login user"""
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        login(request, user)
        
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Login successful.'
        }, status=status.HTTP_200_OK)


class UserLogoutView(APIView):
    """Logout user"""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        logout(request)
        return Response({
            'message': 'Logout successful.'
        }, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveAPIView):
    """Get current user profile"""
    
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UserProfileUpdateView(generics.UpdateAPIView):
    """Update user profile"""
    
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """Change user password"""
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'message': 'Password changed successfully.'
        }, status=status.HTTP_200_OK)


# CSRF Token View - NO INDENTATION!
@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})