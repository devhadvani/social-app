from rest_framework import serializers
from .models import Test

class Textserializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['text']


from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            # username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
