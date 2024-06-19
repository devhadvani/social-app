from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import UserModelSerializer

class UserProfileListCreateView(ListCreateAPIView):
    """Generic View for Listing and Creating User Profiles"""

    queryset = User.objects.all()
    serializer_class = UserModelSerializer
    permission_classes = [AllowAny]

    def create(self, validated_data):
        user = Customser.objects.create_user(**validated_data)
        return user