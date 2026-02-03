from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'transaction_id',
        'order',
        'user',
        'payment_method',
        'amount',
        'status',
        'created_at'
    ]
    list_filter = ['payment_method', 'status', 'created_at']
    search_fields = [
        'transaction_id',
        'external_reference',
        'order__order_number',
        'user__email',
        'phone_number'
    ]
    readonly_fields = ['transaction_id', 'created_at', 'updated_at', 'completed_at']
    
    fieldsets = (
        ('Payment Information', {
            'fields': ('transaction_id', 'order', 'user', 'payment_method', 'phone_number', 'amount')
        }),
        ('Status', {
            'fields': ('status', 'external_reference', 'response_message')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'completed_at')
        }),
    )