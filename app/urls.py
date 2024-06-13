from django.urls import path
from .views import *

urlpatterns = [
    path('register/', UserRegistrationAPIView.as_view(), name='register'),
    path('verify-email/<str:token>/', EmailVerificationAPIView.as_view(), name='verify-email'),
    path('login/', UserLoginAPIView.as_view(), name='login'),
    path('logout/', UserLogoutAPIView.as_view(), name='logout'),
    path('test/', Testview.as_view(), name='test'),
    path('create-profile/', CreateProfileAPIView.as_view(), name='create-profile'),
    path('update-profile/<str:name>/', RUDProfileAPIView.as_view(), name='update-profile'),
    path('profile/<str:name>/', UserProfileAPIView.as_view(), name='profile'),
    path('password-reset/', PasswordResetRequestAPIView.as_view(), name='password-reset-request'),
    path('reset-password-confirm/', PasswordResetConfirmAPIView.as_view(), name='password-reset-confirm'),
    path('follow/', FollowUserView.as_view(), name='follow-user'),
    path('unfollow/<str:name>', UnfollowUserView.as_view(), name='unfollow-user'),
    path('followers/<str:name>/', FollowersListView.as_view(), name='followers-list'),
    path('following/<str:name>/', FollowingListView.as_view(), name='following-list'),
    path('posts/', PostCreateView.as_view(), name='post-create'),
    path('home-posts/', HomeFeedView.as_view(), name='home-post'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:pk>/like/', LikeCreateView.as_view(), name='post-like'),
    path('posts/<int:pk>/comment/', CommentCreateView.as_view(), name='post-comment'),
    path('posts/<int:post_id>/comments/', PostCommentsAPIView.as_view(), name='post-comments-list'),
]


