from rest_framework import authentication
from django.contrib.auth.models import User

# to add a user when a tweet is being created, 
# to avoid authentification for development purposes
class DevAuthentication(authentication.BasicAuthentication):
    def authenticate(self, request): 
        user = User.objects.first()
        # user = qs.order_by('?').first()
        print('The lucky user is ', user)
        return (user, None)
