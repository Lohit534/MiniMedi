from rest_framework import serializers
from .models import Symptom

class SymptomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Symptom
        fields = ['id', 'patient_name', 'title', 'age', 'gender', 'severity', 'risk_score', 'duration', 'description', 'ai_analysis', 'created_at']