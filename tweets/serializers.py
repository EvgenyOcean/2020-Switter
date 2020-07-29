from rest_framework import serializers
from django.conf import settings
from .models import Tweet

class TweetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tweet 
        fields = ['content']
        # extra_kwargs = {'content': {'class': 'form-control'}}
        # widgets = {
        #     'content': Textarea(attrs={'class': 'form-control'}),
        # }

    #similar to flask, it passes the cleaned data of a required field as a second argument
    def validate_content(self, content):
        if len(content) > settings.MAX_TWEET_LENGTH:
            raise serializers.ValidationError('The tweet is too long')
        elif len(content) < settings.MIN_TWEET_LENGTH:
            raise serializers.ValidationError('The tweet is too short')
        return content