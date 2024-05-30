from django.shortcuts import render
from .models import Test
from .serializers import Textserializer
from rest_framework import generics

class Testview(generics.ListCreateAPIView):
    queryset = Test.objects.all()
    serializer_class = Textserializer

    def get_queryset(self):
        print(self.request.user)  # Access the request object here
        return super().get_queryset()


from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from .serializers import UserRegistrationSerializer
from django.urls import reverse
from django.shortcuts import get_object_or_404
from .token import EmailVerificationToken
User = get_user_model()



class UserRegistrationAPIView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        token = EmailVerificationToken.for_user(user)
        verification_link = f"http://{self.request.get_host()}/verify-email/{str(token)}/"
        send_mail(
            'Verify your email',
            f'Click the link to verify your email: {verification_link}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

class EmailVerificationAPIView(APIView):
    def get(self, request, token):
        try:
            email_verification_token = EmailVerificationToken(token)
            if email_verification_token['token_type'] != 'email_verification':
                raise ValueError("Token has wrong type")
            user = get_object_or_404(User, id=email_verification_token['user_id'])
            user.email_verified = True
            user.save()
            return Response({'message': 'Email verified successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserLoginAPIView(APIView):
    def post(self, request):
        from rest_framework_simplejwt.tokens import RefreshToken
        from django.contrib.auth import authenticate

        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)

        if user is not None:
            if user.email_verified:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            else:
                return Response({'error': 'Email is not verified'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class UserLogoutAPIView(APIView):
    def post(self, request):
        from rest_framework_simplejwt.tokens import RefreshToken
        try:
            token = request.data.get('refresh_token')
            token = RefreshToken(token)
            token.blacklist()
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
