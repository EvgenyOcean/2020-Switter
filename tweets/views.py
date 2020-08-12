from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.conf import settings
from django.utils.http import url_has_allowed_host_and_scheme

from .serializers import TweetSerializer, TweetActionSerializer, TweetCreateSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import Tweet
from .forms import TweetForm

# Create your views here.
def home(request):
    return render(request, 'pages/home.html', {})

def detail(request, pk):
    # should I handle err if tweet does not exist here? 
    return render(request, 'pages/detail.html', {'tweet_id': pk})

def user(request, username):
    print(request.user.get_username())
    if (username == request.user.get_username()):
        print('got a match!')
        return redirect('home')
    # should I handle err if tweet does not exist here? 
    return render(request, 'pages/user.html', {'username': username})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_tweet(request): 
    serializer = TweetCreateSerializer(data=request.data, context={'request': request})
    if serializer.is_valid(raise_exception=True):
        new_tweet = serializer.save(user=request.user) #it's gonna be an instance of a tweet model
        new_tweet = TweetSerializer(new_tweet, context={'request': request})
        return Response(new_tweet.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def tweets_list(request):
    '''
    REST API endpoint to get the list with all the tweets, 
    thus preventing the whole page rerendering
    Can accept /?username=username, and fetch only the user's tweets
    '''
    username = request.GET.get('username')
    if username:
        qs = Tweet.objects.filter(user__username=username) 
    else:
        qs = Tweet.objects.all() 
    serializer = TweetSerializer(qs, many=True, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def tweet_details(request, pk):
    """
    Retrieve, update or delete a tweet.
    """
    
    try:
        tweet = Tweet.objects.get(pk=pk)
    except Tweet.DoesNotExist:
        return Response({}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TweetSerializer(tweet, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        if request.user == tweet.user: 
            tweet.delete()
            return Response({"message": "The tweet was deleted!"}, 
                            status=status.HTTP_200_OK)
        else:
            return Response({'message': 'You\'re not authorized'}, 
                            status=status.HTTP_403_FORBIDDEN)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def tweet_action(request, pk):
    try:
        tweet = Tweet.objects.get(pk=pk)
    except Tweet.DoesNotExist:
        return Response({}, status=status.HTTP_404_NOT_FOUND)

    user = request.user 

    #1 Serializer to make sure field action is corrent; and potentially check the content
    actionSerializer = TweetActionSerializer(data=request.data)
    if actionSerializer.is_valid(raise_exception=True): 
        action = actionSerializer.validated_data.get('action')
        #isn't content empty? 
        content = actionSerializer.validated_data.get('content')

        if action == 'LIKE': 
            print('liking')
            tweet.likes.add(user)
            return Response({'likes': len(tweet.likes.all())}, 
                            status=status.HTTP_200_OK)

        if action == 'DISLIKE': 
            print('disliking')
            tweet.likes.remove(user)
            return Response({'likes': len(tweet.likes.all())}, status=status.HTTP_200_OK)

        if action == 'RETWEET': 
            retweet = Tweet.objects.create(user=user, original=tweet, content=content)
            #2 Serializer to get a retweet from db and 
            #find parent's content/its content if it would appear to be not a retweet
            serializer = TweetSerializer(retweet, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)

            

### 
# JUST A HISTORICAL REFERENCE :)
###
def add_tweet_dj(request):
    form = TweetForm(request.POST or None) #if GET then request.POST will be False => None
    if request.method == 'POST':

        #if user is not logged in, then he's not allowed to create any tweets, 
        #because db is set up the way, that every tweet must have a user foreign key
        if request.user.is_anonymous: 
            if request.is_ajax(): #if ajax, let js handle the rest
                return JsonResponse({'errors': 'User is not logged in'}, status=401)
            else: 
                return redirect(settings.LOGIN_URL)

        if form.is_valid(): #doesn't seem to be necessary when .save() is used on the form object
            new_tweet = form.save(commit=False) #just created a new instance of a Tweet 

            #that's why commit=False upthere, cuz we need an opportunity to add a user to the tweet
            new_tweet.user = request.user 
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

    #to destructure queryset and get an arr with obj containing the needed proprs
    tweets_list = [x.get_formated_record() for x in qs] 
    
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