from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from .permissions import IsAdminUser

User = get_user_model()


class AdminUserListView(generics.ListAPIView):
    """Admin view to list all users"""
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    search_fields = ['email', 'first_name', 'last_name', 'phone_number']
    filterset_fields = ['user_type', 'is_active']
    ordering_fields = ['created_at', 'email']
    ordering = ['-created_at']


class AdminUserDetailView(generics.RetrieveAPIView):
    """Admin view to get any user details"""
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]