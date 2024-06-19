from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group

from django.contrib.auth import get_user_model
from .models import User, Profile, Follow, Post, PostImage, Like, Comment, CommentLike, Story, StoryImage

User = get_user_model()


class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'is_staff', 'is_superuser')
    search_fields = ('email',)
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name',)}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'is_private')
    search_fields = ('user__email', 'name')

class FollowAdmin(admin.ModelAdmin):
    list_display = ('follower', 'following', 'created_at')
    search_fields = ('follower__email', 'following__email')

class PostAdmin(admin.ModelAdmin):
    list_display = ('user', 'caption', 'created_at')
    search_fields = ('user__email', 'caption')

class PostImageAdmin(admin.ModelAdmin):
    list_display = ('post', 'image', 'created_at')
    search_fields = ('post__caption',)

class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')
    search_fields = ('user__email', 'post__caption')

class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'text', 'created_at')
    search_fields = ('user__email', 'post__caption', 'text')

class CommentLikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'comment', 'created_at')
    search_fields = ('user__email', 'comment__text')

# Unregister the Group model from admin.
admin.site.unregister(Group)

# Register the custom User model with the custom UserAdmin.
admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Follow, FollowAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(PostImage, PostImageAdmin)
admin.site.register(Like, LikeAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(CommentLike, CommentLikeAdmin)
admin.site.register(Story)
admin.site.register(StoryImage)