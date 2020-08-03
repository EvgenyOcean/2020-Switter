from django.contrib import admin
from django.urls import path, include

from tweets.views import home #gotta fix that

urlpatterns = [
    path('', home, name='home'), #gotta fix that
    path('api/tweets/', include('tweets.urls')),
    path('admin/', admin.site.urls),
]
