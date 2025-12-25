from django.urls import path
from .views import log_symptom, check_symptom, log_symptom_detail, clear_all_symptoms

urlpatterns = [
    path('', log_symptom),              
    path('check/', check_symptom), 
    path('clear-all/', clear_all_symptoms),
    path('<int:pk>/', log_symptom_detail, name='log-symptom-detail'),
]