from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'password',
            'password2',
            'address',
            'city'
        ]
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone_number=validated_data.get('phone_number', ''),
            address=validated_data.get('address', ''),
            city=validated_data.get('city',
            'avatar', ''),
            user_type='CUSTOMER'
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            # First check if user exists
            try:
                user_obj = User.objects.get(email=email)
                
                # Check if user is active
                if not user_obj.is_active:
                    raise serializers.ValidationError('Please verify your OTP first. Check your phone for verification code.')
                
            except User.DoesNotExist:
                raise serializers.ValidationError('Invalid email or password.')
            
            # Now authenticate
            user = authenticate(
                request=self.context.get('request'),
                username=email,
                password=password
            )
            
            if not user:
                raise serializers.ValidationError('Invalid email or password.')
                
        else:
            raise serializers.ValidationError('Must include "email" and "password".')
        
        attrs['user'] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'address',
            'city',
            'avatar',
            'user_type',
            'created_at'
        ]
        read_only_fields = ['id', 'email', 'user_type', 'created_at']


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    
    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'phone_number',
            'address',
            'city'
        ]


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change"""
    
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value
    
    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user