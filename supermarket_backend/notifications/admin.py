from django.contrib import admin
from .models import OTP, SMSLog


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ['phone_number', 'otp_code', 'otp_type', 'is_verified', 'attempts', 'created_at', 'expires_at']
    list_filter = ['otp_type', 'is_verified', 'created_at']
    search_fields = ['phone_number', 'otp_code', 'user__email']
    readonly_fields = ['created_at', 'verified_at']


@admin.register(SMSLog)
class SMSLogAdmin(admin.ModelAdmin):
    list_display = ['phone_number', 'sms_type', 'status', 'created_at']
    list_filter = ['sms_type', 'status', 'created_at']
    search_fields = ['phone_number', 'message', 'user__email']
    readonly_fields = ['created_at']