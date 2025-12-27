from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Symptom
from .serializers import SymptomSerializer
from django.conf import settings
from groq import Groq

# Initialize Groq client
client = Groq(api_key=settings.GROQ_API_KEY)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def log_symptom(request):
    if request.method == 'POST':
        serializer = SymptomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Filter symptoms to only show those belonging to the logged-in user
    symptoms = Symptom.objects.filter(user=request.user).order_by('-created_at')
    serializer = SymptomSerializer(symptoms, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_symptom(request):
    description = request.data.get('description', '')
    if not description:
        return Response({'error': 'Description is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Use Groq for free AI analysis
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a clinical assistant. Analyze symptoms and provide 3 possible causes and 2 important precautions. Format as a clear list."
                },
                {
                    "role": "user",
                    "content": description,
                }
            ],
            model="llama-3.3-70b-versatile",
        )
        text = chat_completion.choices[0].message.content.strip()
        suggestions = [line.strip('- ').strip() for line in text.split('\n') if line.strip()]
        return Response({'suggestions': suggestions}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE', 'PATCH'])
@permission_classes([IsAuthenticated])
def log_symptom_detail(request, pk):
    try:
        # Ensure the user can only access their OWN symptom
        symptom = Symptom.objects.get(pk=pk, user=request.user)
        
        if request.method == 'DELETE':
            symptom.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        elif request.method == 'PATCH':
            # Update symptom with new data (e.g., full conversation)
            serializer = SymptomSerializer(symptom, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except Symptom.DoesNotExist:
        return Response({'error': 'Symptom not found or unauthorized'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_all_symptoms(request):
    deleted_count, _ = Symptom.objects.filter(user=request.user).delete()
    return Response({
        'message': 'All symptoms cleared successfully',
        'deleted_count': deleted_count
    }, status=status.HTTP_200_OK)
