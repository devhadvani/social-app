# app/tasks.py
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

@shared_task
def send_password_reset_email(user_email, reset_link):
    send_mail(
        'Password Reset Request',
        f'Click the link to reset your password: {reset_link}',
        settings.DEFAULT_FROM_EMAIL,
        [user_email],
        fail_silently=False,
    )

@shared_task
def send_verification_email(user_email,verification_link):
    send_mail(
    'Verify your email',
    f'Click the link to verify your email: {verification_link}',
    settings.DEFAULT_FROM_EMAIL,
    [user_email],
    fail_silently=False,
    )