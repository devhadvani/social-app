from rest_framework_simplejwt.tokens import Token
from datetime import timedelta
from django.contrib.auth.tokens import PasswordResetTokenGenerator

class EmailVerificationToken(Token):
    token_type = 'email_verification'
    lifetime = timedelta(hours=1)  # Token is valid for 1 hour

    @classmethod
    def for_user(cls, user):
        token = cls()
        token.payload['user_id'] = user.id
        token.payload['email'] = user.email
        token.payload['name'] = user.name
        token.payload['token_type'] = cls.token_type
        return token


class PasswordResetTokenGenerator(PasswordResetTokenGenerator):
    pass

password_reset_token = PasswordResetTokenGenerator()