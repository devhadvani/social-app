from rest_framework.serializers import ModelSerializer, Serializer
from ..models import User

class UserModelSerializer(ModelSerializer):
    
    class Meta:
        model = User
        fields = ['email', 'password']
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5}}

        def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

        def to_representation(self, instance):
        """Overriding to remove Password Field when returning Data"""
        ret = super().to_representation(instance)
        ret.pop('password', None)
        return ret
