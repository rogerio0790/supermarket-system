from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import login, logout, get_user_model
User = get_user_model()
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
from django.core.mail import send_mail
from django.conf import settings
from notifications.models import PasswordResetOTP
from django.utils import timezone

class ForgotPasswordView(APIView):
    """Send password reset OTP to email"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(email=email)
            # Create OTP
            otp = PasswordResetOTP.objects.create(user=user, email=email)
            
            # Send email (console backend by default)
            send_mail(
                'Password Reset OTP',
                f'Your OTP for password reset is: {otp.otp_code}. It expires in 1 hour.',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            
            return Response({'message': 'OTP sent to your email.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            # For security, don't reveal if user exists
            return Response({'message': 'If an account exists with this email, an OTP has been sent.'}, status=status.HTTP_200_OK)

class ResetPasswordView(APIView):
    """Reset password using OTP"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        otp_code = request.data.get('otp')
        new_password = request.data.get('password')
        
        if not all([email, otp_code, new_password]):
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            otp = PasswordResetOTP.objects.get(email=email, otp_code=otp_code, is_verified=False)
            if otp.is_expired():
                return Response({'error': 'OTP has expired'}, status=status.HTTP_400_BAD_REQUEST)
                
            user = otp.user
            user.set_password(new_password)
            user.save()
            
            otp.is_verified = True
            otp.save()
            
            return Response({'message': 'Password reset successful.'}, status=status.HTTP_200_OK)
        except PasswordResetOTP.DoesNotExist:
            return Response({'error': 'Invalid OTP or email'}, status=status.HTTP_400_BAD_REQUEST)

class GoogleLoginView(APIView):
    """Google Login/Register"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            email = request.data.get('email')
            first_name = request.data.get('first_name', '')
            last_name = request.data.get('last_name', '')
            social_id = request.data.get('social_id')
            avatar = request.data.get('avatar', '')
            
            print(f"Google Login Attempt: {email}, social_id: {social_id}")
            
            if not email or not social_id:
                return Response({'error': 'Email and social_id are required'}, status=status.HTTP_400_BAD_REQUEST)
                
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'social_id': social_id,
                    'avatar': avatar,
                    'is_active': True,  # Google users are verified
                    'user_type': 'CUSTOMER'
                }
            )
            
            if not created:
                # Update social_id and avatar if not set
                user.social_id = social_id
                user.avatar = avatar
                user.is_active = True
                user.save()
                
            login(request, user)
            print(f"User logged in: {user.email}")
            
            return Response({
                'user': UserSerializer(user).data,
                'message': 'Google login successful.'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Google Login Error: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
