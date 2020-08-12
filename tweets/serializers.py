from rest_framework import serializers
from django.conf import settings
from .models import Tweet

class TweetActionSerializer(serializers.Serializer):
    action = serializers.CharField()
    content = serializers.CharField(required=False)

    def validate_action(self, action):
        action = action.upper().strip()
        if action in settings.ALLOWED_TWEET_ACTIONS:
            return action 
        else: 
            raise serializers.ValidationError('Unknown action')

class TweetCreateSerializer(serializers.ModelSerializer):
    #to modify sending data
    likes = serializers.SerializerMethodField()
    owner = serializers.SerializerMethodField()
    class Meta:
        model = Tweet 
        fields = ['id', 'content', 'likes', 'owner']

    #specifying the way we want the data to be modified
    def get_likes(self, obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
            #if current user liked the tweet
            user_liked = user in obj.likes.all()

        data = {'likes': obj.likes.all().count(), 'user_liked': user_liked}
        return data
    
    def get_owner(self, obj):
        return obj.user.username

    #similar to flask, it passes the cleaned data of a required field as a second argument
    def validate_content(self, content):
        if len(content) > settings.MAX_TWEET_LENGTH:
            raise serializers.ValidationError('The tweet is too long')
        elif len(content) < settings.MIN_TWEET_LENGTH:
            raise serializers.ValidationError('The tweet is too short')
        return content


class TweetSerializer(serializers.ModelSerializer):
    #to handle receiving data 
    likes = serializers.SerializerMethodField()
    original = TweetCreateSerializer()
    owner = serializers.SerializerMethodField()

    class Meta:
        model = Tweet 
        fields = ['id', 'likes', 'content', 'original', 'owner']

    #specifying the way we want the data to be modified => send
    #here I need to have an access to current_user => using context 
    #here I need to check if current_user likes a tweet
    def get_likes(self, obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
            #if current user liked the tweet
            user_liked = user in obj.likes.all()

        data = {'likes': obj.likes.all().count(), 'user_liked': user_liked}
        return data

    def get_owner(self, obj):
        return obj.user.username