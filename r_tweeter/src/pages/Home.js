import React, {useEffect, useReducer} from 'react';
import CreateTweetForm from '../components/CreateTweetForm';
import Tweet from '../components/Tweet';

import Container from 'react-bootstrap/Container';

function Home(props) {
  //[state] - initstate or sth that dispatch returns 
  //[dispatch] - function with different actions depending on passed attributes. Returns new state! Its parameters: state - prevState, payload - anything you pass as an object to the function. 
  //probably causes extra rerender when initstate is being initialized...
  const [state, dispatch] = useReducer((state, payload)=>{
    let tweets;
    switch(payload.action){
      case 'fetching tweets': 
        return {...state, tweets: payload.tweets};
      case 'changing textarea': 
        return {...state, value: payload.value};
      case 'adding new tweet':
        tweets = [payload.newTweet, ...state.tweets];
        return {value: '', tweets};
      case 'retweeting': 
        tweets = [payload.newTweet, ...state.tweets];
        return {...state, tweets};
      default: 
        throw new Error('What are you doing?');
    }
  }, {value: "", tweets: []})

  useEffect(() => {
    fetch('/api/tweets')
      .then(response => {
        if (response.ok){
          return response.json()
        } else {
          throw new Error('Something went wrong!');
        }
      })
      .then(data => {
        dispatch({action: 'fetching tweets', tweets: data});
      })
      .catch(err => {
        console.log(err.message);
      })
  }, [])

  //basically it's a form, so you could have used FormData
  //but it's just a field, so json is okay
  const handleTweetAdd = (e) => {
    let data = {content: state.value};
    e.preventDefault(); 
    fetch('/api/tweets/add-tweet', {
      method: "POST", 
      headers: {
        'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest',
        'X-Requested-With': 'XMLHttpRequest',
        // some csrf token later on? 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(response => {
        if (response.ok){
          return response.json()
        }else{
          throw new Error('Something went wrong!');
        }
      })
      .then(newTweet => {
        dispatch({action: 'adding new tweet', newTweet});
      })
      .catch(err => {
        console.log(err);
      })
  }

  const handleRetweet = (id) => {
    let action = 'retweet';
    fetch(`/api/tweets/tweet-action/${id}`, {
      method: "POST", 
      headers: {
        'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest',
        'X-Requested-With': 'XMLHttpRequest',
        // some csrf token later on? 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({action}), 
    }).then(response => {
      if (response.ok){
        return response.json()
      }else {
        throw new Error('something went wrong!');
      }
    }).then(newTweet => {
      dispatch({action: 'retweeting', newTweet});
    }).catch(err => {
      console.log(err);
    })
  }

  const handleLikeClick = (id) => {
    let action = state.tweets.find(tweet => tweet.id === id).likes.user_liked ? 'dislike' : 'like';
    fetch(`/api/tweets/tweet-action/${id}`, {
      method: "POST", 
      headers: {
        'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest',
        'X-Requested-With': 'XMLHttpRequest',
        // some csrf token later on? 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({action}), 
    }).then(response => {
      if (response.ok){
        return response.json()
      }else {
        throw new Error('something went wrong!');
      }
    }).then(data => {
      // data => the amount of new likes
      let newLikes = data.likes; 

      // [!] need a deep copy of the state, because we will change the amount of likes right in the object
      let deepStateTweetsCopy = JSON.stringify(state.tweets);
      deepStateTweetsCopy = JSON.parse(deepStateTweetsCopy);
      // find the tweet, likes amount of which, are being changed
      let currentTweet = deepStateTweetsCopy.find(tweet => tweet.id === id);

      // changing original tweet
      currentTweet.likes.likes = newLikes; 
      currentTweet.likes.user_liked = !currentTweet.likes.user_liked;

      // but that's not it, cuz above we just handle the original tweet like changing, but what if that tweet was retweeted, then the tweet also can be found at a_tweet.original and we need to update the UI there as well; anyway the id is the same, so it's easy to do:
      let tweetsContainsOriginal = deepStateTweetsCopy.filter(tweet => {
        if (tweet.original){
          return tweet.original.id === id;
        }
      });

      // oh yeah... it can be retweeted multiple times, so changing it everywhere; 
      if (tweetsContainsOriginal){
        for (let tweetContainsOriginal of tweetsContainsOriginal){
          tweetContainsOriginal.original.likes.likes = newLikes; 
          tweetContainsOriginal.original.likes.user_liked = !tweetContainsOriginal.original.likes.user_liked; 
        }
      }

      // finally, rerendering the updated tweets
      dispatch({action: 'fetching tweets', tweets: deepStateTweetsCopy});

    }).catch(err => {
      console.log(err);
    })
  }

  return (
    <Container>
      <CreateTweetForm dispatch={dispatch} value={state.value} handleTweetAdd={handleTweetAdd}/>
      {state.tweets.map(tweet => <Tweet key={tweet.id} tweet={tweet} handleRetweet={handleRetweet} handleLikeClick={handleLikeClick}/> // handleRetweet is a good idea for HOC maybe...
      )}
    </Container>
  );
}

export default Home;