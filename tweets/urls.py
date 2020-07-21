from django.urls import path, include


from . import views

app_name = 'tweets'

urlpatterns = [
    path('', views.home, name='home'),
    path('<int:tweet_id>', views.tweet_details, name='details'),
    path('tweets/', views.tweets_list),
]