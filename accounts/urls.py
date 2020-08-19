from django.urls import path
from . import views

urlpatterns = [
    path('users_list/', views.users_list),
    path('<str:username>/', views.profile, name='profile'),
    path('adjust-followers/<str:username>/', views.adjust_followers),
]