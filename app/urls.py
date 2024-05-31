from django.urls import path
from .views import *

urlpatterns = [
    path('register/', UserRegistrationAPIView.as_view(), name='register'),
    path('verify-email/<str:token>/', EmailVerificationAPIView.as_view(), name='verify-email'),
    path('login/', UserLoginAPIView.as_view(), name='login'),
    path('logout/', UserLogoutAPIView.as_view(), name='logout'),
    path('test/', Testview.as_view(), name='test'),
    path('create-profile/', CreateProfileAPIView.as_view(), name='create-profile'),
    path('password-reset/', PasswordResetRequestAPIView.as_view(), name='password-reset-request'),
    path('reset-password-confirm/', PasswordResetConfirmAPIView.as_view(), name='password-reset-confirm'),
]

