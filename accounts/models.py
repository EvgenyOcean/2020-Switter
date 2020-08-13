from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    followers = models.ManyToManyField(User, related_name='following')
    bio = models.TextField(null=True, blank=True)
    location = models.CharField(max_length=250, null=True, blank=True)

def create_or_update_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        print('Profile created!')
    # else: 
    #     print('Profile updated!')

post_save.connect(create_or_update_profile, sender=User)