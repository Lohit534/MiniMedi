from django.db import models
from django.contrib.auth.models import User

class Symptom(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='symptoms', null=True, blank=True)
    patient_name = models.CharField(max_length=100, null=True, blank=True)
    title = models.CharField(max_length=200)
    
    # Metadata for UI cards
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=50, null=True, blank=True)
    severity = models.CharField(max_length=20, default='LOW') # LOW, MEDIUM, HIGH
    risk_score = models.IntegerField(default=0) # 0 to 100
    duration = models.IntegerField(null=True, blank=True) # in days
    
    # Detailed analysis
    description = models.TextField(blank=True, null=True) # User's symptoms
    ai_analysis = models.TextField(blank=True, null=True) # AI's suggestions and precautions
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}" if self.user else self.title
