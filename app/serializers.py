from rest_framework import serializers
from .models import Test,Profile,Follow, Post, PostImage, Like, Comment, CommentLike

class Textserializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['text']


from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'password','name','confirm_password')
    
    def validate(self,data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError('Passwords do not match')
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user','bio','profile_image','name','is_private']

        def create(self, validated_data):
            return Profile.objects.create(**validated_data)

from .models import Follow

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ['follower', 'following', 'created_at']

class FollowersSerializer(serializers.ModelSerializer):
    profile_name = serializers.SerializerMethodField()
    class Meta:
        model = Follow
        fields = ['follower', 'following', 'created_at','profile_name']

    def get_profile_name(self,obj):
        print("sdfsd",obj)
        return User.objects.filter(id=obj)

class UserProfileSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(source="profile.bio")
    profile_image = serializers.ImageField(source="profile.profile_image")
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    profile_name = serializers.CharField(source="profile.name")

    class Meta:
        model = User
        fields = ['name','bio','profile_image','followers_count','following_count','profile_name']

    def get_followers_count(self,obj):
        return Follow.objects.filter(following=obj).count()
    def get_following_count(self,obj):
        return Follow.objects.filter(follower=obj).count()

class UserProfileListSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(source="profile.profile_image", read_only=True)
    profile_name = serializers.CharField(source="profile.name", read_only=True)
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id','name', 'profile_image', 'profile_name','is_following']

    def get_is_following(self, obj):
        request = self.context.get('request', None)
        if request and request.user.is_authenticated:
            return Follow.objects.filter(follower=request.user, following=obj).exists()
        return False

class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'image']

class PostSerializer(serializers.ModelSerializer):
    images = PostImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(write_only=True),
        write_only=True
    )
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'user', 'caption', 'created_at', 'updated_at', 'images', 'uploaded_images', 'likes_count', 'comments_count']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'images', 'likes_count', 'comments_count']

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images')
        post = Post.objects.create(**validated_data)

        for image in uploaded_images:
            PostImage.objects.create(post=post, image=image)

        return post


class UserProfileSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(source="profile.bio")
    profile_image = serializers.ImageField(source="profile.profile_image")
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    profile_name = serializers.CharField(source="profile.name")
    is_following = serializers.SerializerMethodField()
    posts = PostSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'bio', 'profile_image', 'followers_count', 'following_count', 'profile_name', 'is_following', 'posts']
    def get_followers_count(self, obj):
        return Follow.objects.filter(following=obj).count()

    def get_following_count(self, obj):
        return Follow.objects.filter(follower=obj).count()

    def get_is_following(self, obj):
        request = self.context.get('request', None)
        if request and request.user.is_authenticated:
            return Follow.objects.filter(follower=request.user, following=obj).exists()
        return False




class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'created_at']
        read_only_fields = ['id', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'text', 'created_at', 'updated_at', 'likes_count']
        read_only_fields = ['id', 'user', 'post', 'created_at', 'updated_at']

    def get_likes_count(self, obj):
        return obj.likes.count()
