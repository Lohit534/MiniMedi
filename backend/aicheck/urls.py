from django.urls import path
from .views import analyze_symptom

urlpatterns = [
    path('', analyze_symptom),
]

