from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from groq import Groq
from django.conf import settings

# Initialize Groq client
client = Groq(api_key=settings.GROQ_API_KEY)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_symptom(request):
    messages = request.data.get('messages', [])
    if not messages:
        return Response({'error': 'Messages required'}, status=status.HTTP_400_BAD_REQUEST)

    system_prompt = (
        "You are MiniMedi, a warm and professional medical assistant. Your goal is to conduct a friendly, human-like consultation.\n"
        "You must gather: Name, Symptoms, Age, Gender, and Duration.\n\n"
        "RULES:\n"
        "1. Start by asking for the user's name if unknown.\n"
        "2. Address the user by their name in every response once known.\n"
        "3. Dynamically extract info from natural speech (e.g., 'I'm 20 and cold' -> Age: 20, Symptom: cold).\n"
        "4. DO NOT repeat questions for info already provided.\n"
        "5. Once all fields (Name, Symptoms, Age, Gender, Duration) are collected, provide a detailed analysis with 5 causes and 3 precautions.\n"
        "6. IMPORTANT: When the analysis is complete, always end with: 'Thank you [Name]! I have saved this consultation to your history for your records.'\n"
        "7. AT THE VERY END, append this hidden block: ###DATA_START###{\"name\": \"...\", \"age\": 0, \"gender\": \"...\", \"symptoms\": \"...\", \"duration\": 0, \"complete\": true/false}###DATA_END###\n"
    )

    full_messages = [{"role": "system", "content": system_prompt}] + messages

    try:
        chat_completion = client.chat.completions.create(
            messages=full_messages,
            model="llama-3.3-70b-versatile",
        )
        text = chat_completion.choices[0].message.content.strip()
        return Response({'response': text})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
