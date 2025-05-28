from django.shortcuts import render, redirect, get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ShortURL
from .serializers import ShortURLSerializer
from django.http import JsonResponse
from .models import ShortURL

def index(request):
    return render(request, 'index.html')

def dashboard(request):
    # Get all shortened URLs ordered by creation date (newest first)
    urls = ShortURL.objects.all().order_by('-created_at')
    return render(request, 'dashboard.html', {'urls': urls})

def stats(request, short_code):
    url = get_object_or_404(ShortURL, short_code=short_code)
    return render(request, 'stats.html', {'url': url})

def redirect_to_original(request, short_code):
    url = get_object_or_404(ShortURL, short_code=short_code)
    url.access_count += 1
    url.save()
    return redirect(url.original_url)

@api_view(['POST'])
def create_short_url(request):
    # Ensure we're using the correct field name
    if 'original_url' not in request.data:
        return Response(
            {"original_url": ["This field is required."]},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = ShortURLSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    # Return detailed validation errors
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_short_url(request, short_code):
    try:
        url = ShortURL.objects.get(short_code=short_code)
    except ShortURL.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = ShortURLSerializer(url)
    return Response(serializer.data)

# In your views.py

@api_view(['PUT'])
def update_short_url(request, short_code):
    try:
        url = ShortURL.objects.get(short_code=short_code)
    except ShortURL.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = ShortURLSerializer(url, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_short_url(request, short_code):
    try:
        url = ShortURL.objects.get(short_code=short_code)
    except ShortURL.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    url.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def get_url_stats(request, short_code):
    try:
        url = ShortURL.objects.get(short_code=short_code)
    except ShortURL.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = ShortURLSerializer(url)
    return Response(serializer.data)

def retrieve_original_url(request, short_code):
    try:
        url = ShortURL.objects.get(short_code=short_code)
        return JsonResponse({
            'original_url': url.original_url,
            'short_code': url.short_code
        })
    except ShortURL.DoesNotExist:
        return JsonResponse({'detail': 'Short URL not found'}, status=404)