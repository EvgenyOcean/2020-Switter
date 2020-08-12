from django.test import TestCase
from rest_framework.test import APITestCase
from django.contrib.auth.models import User

from .models import Tweet

from rest_framework.test import APIClient

# Create your tests here.
class TweetsTesting(TestCase):
    #good for: filling the db, creating users, all the prep work...
    def setUp(self): 
        # note that create_user() [not just .create()] is used to store correct hashed password
        # .create won't hash the password
        # .login() will hash the pw as well, so hashed != unhashed 
        self.user = User.objects.create_user(username='steven', password='hello123Dude')
        self.user2 = User.objects.create_user(username='jojo', password='hello123Dude')

        Tweet.objects.create(user=self.user, content='Thats awesome!')
        Tweet.objects.create(user=self.user, content='Thats awesome!')
        Tweet.objects.create(user=self.user2, content='Thats awesome!!!!')

        #creating a client
        self.client = APIClient()
        self.client.login(username='steven', password='hello123Dude') #should return True if success

    def get_client(self, u='steven', pw='hello123Dude'):
        client = APIClient()
        self.assertTrue(client.login(username=u, password=pw))
        return client


    def test_tweet_detail(self):
        client = self.get_client()
        response = client.get('/api/tweets/1')
        self.assertEqual(response.status_code, 200)
        # print(response.json())


    def test_tweet_list(self):
        client = self.get_client()
        #getting user and checking its username
        user = User.objects.first() 
        self.assertEqual(user.username, 'steven')

        #getting a list of all the tweet
        response = client.get('/api/tweets/')
        # print(response.json())
        #[{'id': 1, 'content': 'Thats awesome!', 'likes': 0, 'original': None}]
        self.assertEqual(len(response.json()), 3)

    def test_action_like_dislike(self): 
        client = self.get_client()
        client2 = self.get_client('jojo', 'hello123Dude')

        response = client.post('/api/tweets/tweet-action/1', {'action': 'like'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['likes'], 1)
        print(response.json()) #{'likes': 1}

        response = client2.post('/api/tweets/tweet-action/1', {'action': 'like'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['likes'], 2)

        response = client.post('/api/tweets/tweet-action/1', {'action': 'dislike'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['likes'], 1)

    def test_action_retweet(self): 
        client = self.get_client()

        response = client.post('/api/tweets/tweet-action/1', {'action': 'retweet'})
        self.assertTrue(response.json()['original'])

    def test_creting_tweet(self): 
        client = self.get_client()

        #you don't have to specify user, because client stands for one.
        response = client.post('/api/tweets/add-tweet', {'content': 'How bout that?'})

    def test_delete_tweet(self):
        client = self.get_client()
        client2 = self.get_client('jojo', 'hello123Dude')

        #deleting own tweets
        response = client.delete('/api/tweets/1')
        self.assertEqual(response.status_code, 204)

        #when you're not using serializer to send the data, you need to use .data method to get the data (maybe it's an object?) 
        #return Response({'message': 'The tweet was deleted!'}, status=status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data['message'], 'The tweet was deleted!')

        #deleting already deleted tweet
        response = client.delete('/api/tweets/1')
        self.assertEqual(response.status_code, 404)

        #deletings other's tweets 
        response = client2.delete('/api/tweets/2')
        self.assertEqual(response.status_code, 403)

