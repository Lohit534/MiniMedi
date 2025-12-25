from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model, authenticate
from rest_framework import status
import jwt
from datetime import datetime, timedelta
import os
import requests

from django.conf import settings
from django.utils import timezone
from django.db import IntegrityError

import re

User = get_user_model()

def is_strong_password(password):
    """
    Validates that a password is strong:
    - At least 6 characters long
    - At least one uppercase letter
    - At least one digit
    - At least one special character
    """
    if len(password) < 6:
        return False, "Password must be at least 6 characters long."
    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter."
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one number."
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain at least one special character."
    return True, ""

def create_jwt(user):
    payload = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "exp": timezone.now() + timedelta(hours=1),
        "iat": timezone.now()
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

def decode_jwt(token):
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

class SignupView(APIView):
    def post(self, request):
        data = request.data
        email = data.get("email")
        username = data.get("username") or email # Default to email if username is blank
        password = data.get("password")
        name = data.get("name")

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Strong Password Validation
        is_strong, msg = is_strong_password(password)
        if not is_strong:
            return Response({"error": msg}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=name
            )
        except IntegrityError as e:
            return Response({"error": f"Username or email already exists: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Error creating user: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        token = create_jwt(user)
        return Response({"token": token}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        data = request.data
        email = data.get("email")
        password = data.get("password")

        user_qs = User.objects.filter(email=email)
        if not user_qs.exists():
            return Response({"error": "User not found."}, status=404)

        user = authenticate(username=user_qs[0].username, password=password)
        if user:
            token = create_jwt(user)
            return Response({"token": token}, status=200)
        return Response({"error": "Invalid credentials."}, status=401)

class ProfileView(APIView):
    def get(self, request):
        auth_header = request.headers.get("Authorization", "")
        token = auth_header.replace("Bearer ", "")
        decoded = decode_jwt(token)

        if not decoded:
            return Response({"error": "Invalid or expired token."}, status=401)

        return Response({
            "username": decoded["username"],
            "email": decoded["email"],
            "name": User.objects.get(username=decoded["username"]).first_name
        }, status=200)

class GoogleLoginView(APIView):
    def post(self, request):
        access_token = request.data.get("token")
        if not access_token:
            return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Get user info from Google using the access token
            response = requests.get('https://www.googleapis.com/oauth2/v3/userinfo', 
                                    params={'access_token': access_token})
            
            if not response.ok:
                return Response({"error": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)
            
            idinfo = response.json()
            email = idinfo['email']
            name = idinfo.get('name', '')
            google_id = idinfo['sub']

            # Find or create user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0] + "_" + google_id[:5],
                    'first_name': name
                }
            )

            # Generate our app's JWT
            app_token = create_jwt(user)
            return Response({"token": app_token}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
