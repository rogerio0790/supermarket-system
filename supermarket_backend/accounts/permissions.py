from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow admin users.
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.user_type == 'ADMIN'


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admin users.
    """
    
    def has_object_permission(self, request, view, obj):
        # Admin users have full access
        if request.user.user_type == 'ADMIN':
            return True
        
        # Check if object has a user field and if it matches the request user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False