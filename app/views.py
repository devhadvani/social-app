from django.shortcuts import render
from .models import Test
from .serializers import Textserializer
from rest_framework import generics

class Testview(generics.ListCreateAPIView):
    queryset = Test.objects.all()
    serializer_class = Textserializer

