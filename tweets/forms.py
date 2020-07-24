from django.forms import ModelForm, Textarea, ValidationError
from .models import Tweet

MIN_TWEET_LENGTH = 5
MAX_TWEET_LENGTH = 250

class TweetForm(ModelForm):
    class Meta:
        model = Tweet 
        fields = ['content']
        widgets = {
            'content': Textarea(attrs={'class': 'form-control'}),
        }

    def clean_content(self):
        content = self.cleaned_data.get('content')
        if len(content) > MAX_TWEET_LENGTH:
            raise ValidationError('The tweet is too long')
        elif len(content) < MIN_TWEET_LENGTH:
            raise ValidationError('The tweet is too short')
        return content