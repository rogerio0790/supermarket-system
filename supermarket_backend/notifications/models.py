from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import random
import string


class OTP(models.Model):
    """OTP model for phone verification"""
    
    OTP_TYPE_CHOICES = (
        ('REGISTRATION', 'Registration'),
        ('PASSWORD_RESET', 'Password Reset'),
        ('PHONE_VERIFICATION', 'Phone Verification'),
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='otps'
    )
    phone_number = models.CharField(max_length=15)
    otp_code = models.CharField(max_length=6)
    otp_type = models.CharField(max_length=20, choices=OTP_TYPE_CHOICES, default='REGISTRATION')
    
    is_verified = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)
    max_attempts = models.IntegerField(default=3)
    
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    verified_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'OTP'
        verbose_name_plural = 'OTPs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"OTP for {self.phone_number} - {self.otp_code}"
    
    def save(self, *args, **kwargs):
        if not self.otp_code:
            self.otp_code = self.generate_otp()
        if not self.expires_at:
            # OTP expires in 10 minutes
            self.expires_at = timezone.now() + timedelta(minutes=10)
        super().save(*args, **kwargs)
    
    @staticmethod
    def generate_otp(length=6):
        """Generate random 6-digit OTP"""
        return ''.join(random.choices(string.digits, k=length))
    
    def is_expired(self):
        """Check if OTP is expired"""
        return timezone.now() > self.expires_at
    
    def verify(self, code):
        """Verify OTP code"""
        if self.is_expired():
            return False, "OTP has expired"
        
        if self.attempts >= self.max_attempts:
            return False, "Maximum attempts exceeded"
        
        if self.is_verified:
            return False, "OTP already verified"
        
        self.attempts += 1
        
        if self.otp_code == code:
            self.is_verified = True
            self.verified_at = timezone.now()
            self.save()
            return True, "OTP verified successfully"
        
        self.save()
        return False, f"Invalid OTP. {self.max_attempts - self.attempts} attempts remaining"


class SMSLog(models.Model):
    """Log all SMS sent for tracking"""
    
    SMS_TYPE_CHOICES = (
        ('OTP', 'OTP'),
        ('ORDER_CONFIRMATION', 'Order Confirmation'),
        ('PAYMENT_CONFIRMATION', 'Payment Confirmation'),
        ('GENERAL', 'General'),
    )
    
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('SENT', 'Sent'),
        ('FAILED', 'Failed'),
    )
    
    phone_number = models.CharField(max_length=15)
    message = models.TextField()
    sms_type = models.CharField(max_length=30, choices=SMS_TYPE_CHOICES, default='GENERAL')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sms_logs'
    )
    
    response = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'SMS Log'
        verbose_name_plural = 'SMS Logs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"SMS to {self.phone_number} - {self.sms_type}"
