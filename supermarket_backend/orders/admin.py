from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name', 'product_price', 'quantity', 'total_price', 'created_at']
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_number',
        'user',
        'status',
        'payment_status',
        'total',
        'total_items',
        'created_at'
    ]
    list_filter = ['status', 'payment_status', 'created_at']
    search_fields = ['order_number', 'user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['order_number', 'subtotal', 'total', 'created_at', 'updated_at']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'user', 'status', 'payment_status')
        }),
        ('Delivery Information', {
            'fields': ('delivery_address', 'delivery_city', 'phone_number')
        }),
        ('Pricing', {
            'fields': ('subtotal', 'delivery_fee', 'total')
        }),
        ('Additional Info', {
            'fields': ('notes', 'created_at', 'updated_at', 'delivered_at')
        }),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_name', 'quantity', 'product_price', 'total_price', 'created_at']
    list_filter = ['created_at']
    search_fields = ['order__order_number', 'product_name']
    readonly_fields = ['total_price', 'created_at']