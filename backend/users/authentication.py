import jwt
import os
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None

        try:
            # Expecting "Bearer <token>"
            prefix, token = auth_header.split(" ")
            if prefix.lower() != "bearer":
                return None
        except ValueError:
            return None

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")

        try:
            user = User.objects.get(id=payload["id"])
        except User.DoesNotExist:
            raise AuthenticationFailed("User not found")

        return (user, None)
