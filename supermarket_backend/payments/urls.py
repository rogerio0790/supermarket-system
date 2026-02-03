from django.urls import path
from .views import (
    PaymentListView,
    PaymentDetailView,
    InitiatePaymentView,
    VerifyPaymentView,
    CancelPaymentView
)

app_name = 'payments'

urlpatterns = [
    path('', PaymentListView.as_view(), name='payment-list'),
    path('initiate/', InitiatePaymentView.as_view(), name='initiate-payment'),
    path('verify/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('<str:transaction_id>/', PaymentDetailView.as_view(), name='payment-detail'),
    path('<str:transaction_id>/cancel/', CancelPaymentView.as_view(), name='cancel-payment'),
]