from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Transaction, Role


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name']


class TransactionSerializer(serializers.ModelSerializer):
    isFraud = serializers.BooleanField()

    class Meta:
        model = Transaction
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.PrimaryKeyRelatedField(queryset=Role.objects.all(), required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'role')

    def create(self, validated_data):
        role = validated_data.pop('role', None)
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email']
        )
        if role:
            user.role = role
            user.save()
        return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'role_id']
        extra_kwargs = {'email': {'required': True}}