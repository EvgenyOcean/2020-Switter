from django.urls import path
from . import views

urlpatterns = [
    path('<str:username>/', views.profile, name='profile'),
    path('adjust-followers/<str:username>/', views.adjust_followers),
]