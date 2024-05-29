from rest_framework import serializers
from .models import Test

class Textserializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['text']