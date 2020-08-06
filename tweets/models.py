import random
from django.db import models
from django.contrib.auth.models import User

# Custom intermediate table
class TweetLike(models.Model):
    tweet = models.ForeignKey('Tweet', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

class Tweet(models.Model):
    #self referencing to implement retweet (same as manyToOne, meaning 1 tweet may have many retweets)
    original = models.ForeignKey('self', blank=True, on_delete=models.SET_NULL, null=True)

    content = models.TextField(null=True, blank=True)
    image = models.FileField(upload_to='images/', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    #im not specifying blank=True in the below field
    #will show all the users who liked the tweet
    likes = models.ManyToManyField(User, related_name='tweet_user', through='TweetLike')

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        desc = f'Tweet #{self.id}'
        return desc

    ######
    #could be commented out, but historical refernce...↓
    ######
    
    #own serializer before rest_framework
    def get_formated_record(self):
        return {
            'id': self.id, 
            'content': self.content,
            'likesAmount': random.randrange(0,50)
        }

    #for serializers to get parents content, but not the parent object itself...
    @property
    def is_retweet(self):
        return self.original != None
