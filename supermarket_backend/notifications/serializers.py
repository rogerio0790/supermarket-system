from rest_framework import serializers
from .models import OTP


class OTPVerifySerializer(serializers.Serializer):
    """Serializer for OTP verification"""
    
    phone_number = serializers.CharField(max_length=15)
    otp_code = serializers.CharField(max_length=6)
    
    def validate_otp_code(self, value):
        if len(value) != 6 or not value.isdigit():
            raise serializers.ValidationError("OTP must be 6 digits")
        return value


class OTPResendSerializer(serializers.Serializer):
    """Serializer for resending OTP"""
    
    phone_number = serializers.CharField(max_length=15)