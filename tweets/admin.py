from django.contrib import admin
from .models import Tweet

# Register your models here.
class TweetAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'user') #any field names of the model to display (you can't use filtering, cuz it's looking only for field names, specifically for its __str__)
    search_fields = ['content', 'user__username'] #looking inside the specified fields values (you can and probably must use filtering in foreign keys)

admin.site.register(Tweet, TweetAdmin)