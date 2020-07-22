from django.shortcuts import render, reverse
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.conf import settings
from django.utils.http import url_has_allowed_host_and_scheme

from .models import Tweet
from .forms import TweetForm

import random

# Create your views here.
def home(request):
    return render(request, 'pages/home.html', {})

def add_tweet(request):
    form = TweetForm(request.POST or None) #if GET then request.POST will be False => None
    if request.method == 'POST':
        if form.is_valid(): #doesn't seem to be necessary when .save() is used on the form object
            new_tweet = form.save(commit=False) #just created a new instance of a Tweet 
            new_tweet.save() #to save to the db or use first .save with commit=True (default)

            # Checking if the redirect is safe, otherwise return to the home page
            next_url = request.POST.get('redirect')
            if next_url and url_has_allowed_host_and_scheme(next_url, settings.ALLOWED_HOSTS):
                return HttpResponseRedirect(next_url)
            else:
                return HttpResponseRedirect('/')    
        #still vating to do sth if form is invalid            
    return render(request, 'components/form.html', {'form': form}) #just leave it here for a little bit

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