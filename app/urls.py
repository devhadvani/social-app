from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.Testview.as_view(), name="test"),
]
