from django.urls import path
from .views import VerifyOTPView, ResendOTPView

app_name = 'notifications'

urlpatterns = [
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('resend-otp/', ResendOTPView.as_view(), name='resend-otp'),
]