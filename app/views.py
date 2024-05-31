from django.shortcuts import render
from .models import Test
from .serializers import Textserializer
from rest_framework import generics
from datetime import timedelta
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
from .token import EmailVerificationToken,password_reset_token
from rest_framework_simplejwt.tokens import Token
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from .serializers import PasswordResetRequestSerializer, PasswordResetSerializer


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


class CustomAccessToken(AccessToken):
    token_type = 'access'
    lifetime = timedelta(hours=1)  # Adjust this as per your requirement

    @classmethod
    def for_user(cls, user):
        token = super().for_user(user)
        # Add custom user information to the token payload
        token['email'] = user.email
        # token['username'] = user.username
        # Add any other fields you want
        return token

class CustomRefreshToken(RefreshToken):
    token_type = 'refresh'
    lifetime = timedelta(days=7) 

    @classmethod
    def for_user(cls, user):
        token = super().for_user(user)
        # Add custom user information to the token payload
        token['email'] = user.email
        # token['username'] = user.username
        # Add any other fields you want
        return token

class UserLoginAPIView(APIView):
    def post(self, request):
        from django.contrib.auth import authenticate

        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)

        if user is not None:
            if user.email_verified:
                refresh = CustomRefreshToken.for_user(user)  # Use CustomRefreshToken here
                access = CustomAccessToken.for_user(user)   # Use CustomAccessToken here
                return Response({
                    'refresh': str(refresh),
                    'access': str(access),
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



class Testview(generics.ListCreateAPIView):
    queryset = Test.objects.all()
    serializer_class = Textserializer

    def get_queryset(self):
        print(self.request.user) 
        return super().get_queryset()

class PasswordResetRequestAPIView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = get_object_or_404(User, email=email)
            token = password_reset_token.make_token(user)
            reset_link = f"http://{self.request.get_host()}/reset-password-confirm/?token={token}&email={email}"
            send_mail(
                'Password Reset Request',
                f'Click the link to reset your password: {reset_link}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            return Response({'message': 'Password reset link sent'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmAPIView(APIView):
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            email = request.query_params.get('email')
            user = get_object_or_404(User, email=email)
            if password_reset_token.check_token(user, token):
                user.set_password(serializer.validated_data['new_password'])
                user.save()
                return Response({'message': 'Password reset successfully'}, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)