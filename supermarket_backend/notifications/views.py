from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import OTP
from .serializers import OTPVerifySerializer, OTPResendSerializer
from .services import SMSService

User = get_user_model()


class VerifyOTPView(APIView):
    """Verify OTP code"""
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        phone_number = serializer.validated_data['phone_number']
        otp_code = serializer.validated_data['otp_code']
        
        # Get the most recent OTP for this phone number
        try:
            otp = OTP.objects.filter(
                phone_number=phone_number,
                otp_type='REGISTRATION'
            ).latest('created_at')
        except OTP.DoesNotExist:
            return Response(
                {'error': 'No OTP found for this phone number'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verify OTP
        success, message = otp.verify(otp_code)
        
        if success:
            # Activate user account - FIXED VERSION
            user = otp.user
            user.is_active = True
            user.save(update_fields=['is_active'])  # Explicitly save is_active field
            
            # Refresh from database to confirm
            user.refresh_from_db()
            
            print(f"✅ User {user.email} activated: is_active={user.is_active}")  # Debug print
            
            return Response({
                'message': 'Account verified successfully! You can now login.',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'phone_number': user.phone_number,
                    'is_active': user.is_active
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': message},
                status=status.HTTP_400_BAD_REQUEST
            )

class ResendOTPView(APIView):
    """Resend OTP code"""
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = OTPResendSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        phone_number = serializer.validated_data['phone_number']
        
        # Get user by phone number
        try:
            user = User.objects.get(phone_number=phone_number)
        except User.DoesNotExist:
            return Response(
                {'error': 'No user found with this phone number'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Create new OTP
        otp = OTP.objects.create(
            user=user,
            phone_number=phone_number,
            otp_type='REGISTRATION'
        )
        
        # Send OTP via SMS
        success, response = SMSService.send_otp(phone_number, otp.otp_code, user)
        
        if success:
            return Response({
                'message': 'OTP resent successfully',
                'expires_in_minutes': 10
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Failed to send OTP'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )