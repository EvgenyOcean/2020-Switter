from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse

from .models import Tweet

import random

# Create your views here.
def home(request):
    return render(request, 'pages/home.html', {})

#in urls.py: path('tweets', 'views.tweets_list')
def tweets_list(request):
    '''
    REST API endpoint to get the list with all the tweets, thus preventing the whole page rerendering
    '''
    qs = Tweet.objects.all() #queryset is an arr with dict-like objects
    tweets_list = [{'id': x.id, 'content': x.content, 'likesAmount': random.randrange(0,10)} for x in qs] #to destructure queryset and get an arr with obj containing the needed proprs
    
    data = {'response': tweets_list}
        
    return JsonResponse(data)

def tweet_details(request, tweet_id):
    '''
    REST API TO SEND THE DATA
    JsonResponse should be used to send json with content_type='application/json'
    and args: data and status code, which can be change accordingly
    '''
    data = {
        'id': tweet_id
    }
    status = 200
    try:
        tweet = Tweet.objects.get(id=tweet_id)
        data['content'] = tweet.content
    except Tweet.DoesNotExist: 
        data['message'] = 'Not Found'
        status = 404
    return JsonResponse(data, status=status)

