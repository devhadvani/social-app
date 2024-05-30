from django.urls import path
from .views import UserRegistrationAPIView, EmailVerificationAPIView, UserLoginAPIView, UserLogoutAPIView,Testview

urlpatterns = [
    path('register/', UserRegistrationAPIView.as_view(), name='register'),
    path('verify-email/<str:token>/', EmailVerificationAPIView.as_view(), name='verify-email'),
    path('login/', UserLoginAPIView.as_view(), name='login'),
    path('logout/', UserLogoutAPIView.as_view(), name='logout'),
    path('test/', Testview.as_view(), name='test'),
]

