from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

from .models import Profile
from .forms import UserRegisterFrom
from .serializers import ProfileSerializer, ProfileUpdateSerializer, UsersSerializer

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# Create your views here.
def register(request):
    if request.method == 'POST':
        form = UserRegisterFrom(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            print(f'New account for {username} was created')
            return redirect('home')
    else: 
        form = UserRegisterFrom()
    return render(request, 'accounts/register.html', {'form': form})

@login_required
def users(request): 
    return render(request, 'accounts/users.html')

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def profile(request, username):  
    user_qs = Profile.objects.filter(user__username=username)
    if user_qs.exists():
        if request.method == 'GET':
            # use serializer
            user = user_qs.first()
            serializer = ProfileSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        if request.method == 'POST': 
            user = User.objects.get(username=username)
            if not request.user == user:
                return Response({"message": "You're not authorized!"}, status=status.HTTP_401_UNAUTHORIZED)
            
            serializer = ProfileUpdateSerializer(data=request.data, context={'request': request})
            if serializer.is_valid(raise_exception=True):
                username = serializer.validated_data.get('username')
                first_name = serializer.validated_data.get('firstName')
                last_name = serializer.validated_data.get('lastName')
                email = serializer.validated_data.get('email')
                bio = serializer.validated_data.get('bio')
                location = serializer.validated_data.get('location')

                user.username = username
                user.first_name = first_name
                user.last_name = last_name
                user.email = email
                user.save()

                profile = user.profile
                profile.bio = bio
                profile.location = location
                profile.save()

                return Response({"message": "Everything went smooth!"}, status=status.HTTP_200_OK)

    else: 
        return Response({"message": "User's profile was not found!"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def adjust_followers(request, username):
    current_user = request.user
    try: 
        following_user = User.objects.get(username=username)
    except User.DoesNotExist: 
        return Response({'message': 'You cant follow the user'}, status=status.HTTP_404_NOT_FOUND)

    if current_user == following_user:
        return Response({'message': 'Something went wrong!'}, status=status.HTTP_400_BAD_REQUEST)

    if current_user in following_user.profile.followers.all():
        # perform unfollowing
        following_user.profile.followers.remove(current_user)
        serializer = ProfileSerializer(following_user.profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        #perform following
        following_user.profile.followers.add(current_user)
        serializer = ProfileSerializer(following_user.profile)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def users_list(request):
    '''
    An API to get all the registered users
    To display where needed
    '''
    users = User.objects.all() 
    serializer = UsersSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)