from django.shortcuts import render, reverse, redirect
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.conf import settings
from django.utils.http import url_has_allowed_host_and_scheme
from django.views.decorators.csrf import csrf_exempt

from .serializers import TweetSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Tweet
from .forms import TweetForm

import random

# Create your views here.
def home(request):
    return render(request, 'pages/home.html', {})


@api_view(['POST'])
def add_tweet(request): 
    serializer = TweetSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user)
        return Response(serializer.data)

@api_view(['GET'])
def tweets_list(request):
    '''
    REST API endpoint to get the list with all the tweets, thus preventing the whole page rerendering
    '''
    qs = Tweet.objects.all() 
    serializer = TweetSerializer(qs, many=True)
    return Response(serializer.data)

@api_view(['GET', 'PUT', 'DELETE'])
def tweet_details(request, pk):
    """
    Retrieve, update or delete a tweet.
    """
    try:
        tweet = Tweet.objects.get(pk=pk)
    except Tweet.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SnippetSerializer(tweet)
        return Response(tweet.data)
    


### 
# JUST A HISTORICAL REFERENCE :)
###
def add_tweet_dj(request):
    form = TweetForm(request.POST or None) #if GET then request.POST will be False => None
    if request.method == 'POST':

        #if user is not logged in, then he's not allowed to create any tweets, because db is set up the way, that every tweet must have a user foreign key
        if request.user.is_anonymous: 
            if request.is_ajax(): #if ajax, let js handle the rest
                return JsonResponse({'errors': 'User is not logged in'}, status=401)
            else: 
                return redirect(settings.LOGIN_URL)

        if form.is_valid(): #doesn't seem to be necessary when .save() is used on the form object
            new_tweet = form.save(commit=False) #just created a new instance of a Tweet 
            new_tweet.user = request.user #that's why commit=False upthere, cuz we need an opportunity to add a user to the tweet
            new_tweet.save() #to save to the db or use first .save with commit=True (default)
            # If ajax request, then don't bother with redirect, cuz it's unnecessary
            if request.is_ajax():
                return JsonResponse(new_tweet.get_formated_record(), status=201)
            # Checking if the redirect is safe, otherwise return to the home page
            next_url = request.POST.get('redirect')

            #if it's not ajax, then user needs to be redirected or the page needs to be reloaded
            if next_url and url_has_allowed_host_and_scheme(next_url, settings.ALLOWED_HOSTS):
                return HttpResponseRedirect(next_url)
            else:
                return HttpResponseRedirect('/')    

        # if form is not valid...
        else: 
            if request.is_ajax(): 
                return JsonResponse({'errors': form.errors}, status=400)
            else: 
                for field in form.errors: #to add a red border if there's an exception
                    form[field].field.widget.attrs['class'] += ' border-danger'
        #still vating to do sth if form is invalid            
    return render(request, 'components/form.html', {'form': form}) 

#in urls.py: path('tweets', 'views.tweets_list')
def tweets_list_dj(request):
    '''
    REST API endpoint to get the list with all the tweets, thus preventing the whole page rerendering
    '''
    qs = Tweet.objects.all() #queryset is an arr with dict-like objects
    tweets_list = [x.get_formated_record() for x in qs] #to destructure queryset and get an arr with obj containing the needed proprs
    
    data = {'response': tweets_list}
        
    return JsonResponse(data)

def tweet_details_dj(request, tweet_id):
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