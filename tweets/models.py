import random
from django.db import models

# Create your models here.
class Tweet(models.Model):
    content = models.TextField(null=True, blank=True)
    image = models.FileField(upload_to='images/', null=True, blank=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        desc = f'Tweet #{self.id}'
        return desc

    def get_formated_record(self):
        return {
            'id': self.id, 
            'content': self.content,
            'likesAmount': random.randrange(0,50)
        }