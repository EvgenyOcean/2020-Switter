from rest_framework import serializers
from .models import Profile
from django.contrib.auth.models import User

class ProfileUpdateSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, max_length=30)
    firstName = serializers.CharField(required=False, allow_blank=True, max_length=20)
    lastName = serializers.CharField(required=False, allow_blank=True, max_length=20)
    email = serializers.EmailField()
    bio = serializers.CharField(required=False, allow_blank=True, max_length=250)
    location = serializers.CharField(required=False, allow_blank=True, max_length=100)

    def validate_username(self, username):  
        #check if username has already been taken (but not by this user)
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
            if user.username == username:
                return username

            if User.objects.filter(username=username).exists():
                raise serializers.ValidationError('This username has already been taken!')

            return username

    def validate_email(self, email):
        #check if email has already been taken (but not by this user)
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
            if user.email == email:
                return email

            if User.objects.filter(email=email).exists():
                raise serializers.ValidationError('This email has already been taken!')

            return email



class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    followerings = serializers.SerializerMethodField()
    class Meta: 
        model = Profile
        fields = ['followerings', 'bio', 'location', 'user']

    def get_user(self, obj):
        # returns an object with first_name, last_name, username
        # if page == 'Home' and current_user, then you can send email, maybe..
        username = obj.user.username
        first_name = obj.user.first_name
        last_name = obj.user.last_name
        email = obj.user.email
        return {'username': username, 'first_name': first_name, 'last_name': last_name, 'email': email}
    
    def get_followerings(self, obj):
        # What do I need to get? 
        # → Username, then I can check feedOwner and render the correct btn: follow or unfollow
        # → I can get their tweets, using username 
        followers = [follower.username for follower in obj.followers.all()]
        following = [following.user.username for following in obj.user.following.all()]
        return {'followers': followers, 'following': following}

class UsersSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'profile']

    def get_profile(self, obj): 
        data = {
            'bio': obj.profile.bio, 
            'location': obj.profile.location, 
            'avatar': obj.profile.avatar.url
        }
        return data