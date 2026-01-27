from rest_framework import serializers
from django.contrib.auth.models import User
from .models import IssueReport

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class IssueReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueReport
        fields = ['id', 'subject', 'email', 'description', 'user_agent', 'created_at']
        read_only_fields = ['created_at']
