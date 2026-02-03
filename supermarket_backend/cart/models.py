from django.db import models
from django.conf import settings
from products.models import Product
from django.core.validators import MinValueValidator


class Cart(models.Model):
    """Shopping cart model"""
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Cart'
        verbose_name_plural = 'Carts'
    
    def __str__(self):
        return f"Cart - {self.user.email}"
    
    @property
    def total_items(self):
        """Total number of items in cart"""
        return sum(item.quantity for item in self.items.all())
    
    @property
    def subtotal(self):
        """Calculate cart subtotal"""
        return sum(item.total_price for item in self.items.all())
    
    @property
    def total(self):
        """Calculate cart total (can add tax/shipping later)"""
        return self.subtotal


class CartItem(models.Model):
    """Cart item model"""
    
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )
    quantity = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)]
    )
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Cart Item'
        verbose_name_plural = 'Cart Items'
        unique_together = ('cart', 'product')
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
    
    @property
    def total_price(self):
        """Calculate total price for this cart item"""
        return self.product.final_price * self.quantity
    
    def save(self, *args, **kwargs):
        # Ensure quantity doesn't exceed stock
        if self.quantity > self.product.stock:
            raise ValueError(f"Only {self.product.stock} items available in stock")
        super().save(*args, **kwargs)