from django.urls import path, include


from . import views

app_name = 'tweets'

urlpatterns = [
    path('', views.home, name='home'),
    path('tweets/', views.tweets_list),
    path('tweets/<int:pk>', views.tweet_details, name='details'),
    path('add-tweet', views.add_tweet, name='addtweet'),
]