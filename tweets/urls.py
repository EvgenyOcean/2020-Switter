from django.urls import path, include

from . import views


app_name = 'tweets'
urlpatterns = [
    path('', views.tweets_list),
    path('<int:pk>', views.tweet_details, name='details'),
    path('add-tweet', views.add_tweet, name='addtweet'),
    path('tweet-action/<int:pk>', views.tweet_action, name='action'),
]