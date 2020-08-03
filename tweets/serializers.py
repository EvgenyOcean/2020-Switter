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
    class Meta:
        model = Tweet 
        fields = ['id', 'content', 'likes']

    #specifying the way we want the data to be modified
    def get_likes(self, obj):
        return obj.likes.all().count()

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

    class Meta:
        model = Tweet 
        fields = ['id', 'content', 'likes', 'content', 'original']

    #specifying the way we want the data to be modified => send
    def get_likes(self, obj):
        return obj.likes.all().count()