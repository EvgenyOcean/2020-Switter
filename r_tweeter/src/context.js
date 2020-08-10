import React from "react";

export const UserContext = React.createContext();

class UserContextProvider extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      dataset: {
        username: props.username, 
        canTweet: props.canTweet,
        page: props.page,
        tweetId: props.tweetId
      },
      value: '', //maybe later on value will be somewhere else ? 
      tweets: [],
    }
    this.handleRetweet = this.handleRetweet.bind(this);
    this.handleTweetAdd = this.handleTweetAdd.bind(this);
    this.handleLikeClick = this.handleLikeClick.bind(this);
    this.handleTextArea = this.handleTextArea.bind(this);
  }

  componentDidMount(){
    // so by default im fetching all the tweets
    let endpoint = '/api/tweets';

    if (this.state.dataset.username){
      // if django passes username
      endpoint += `/?username=${this.state.dataset.username}`;
    } else if (this.state.dataset.tweetId){
      // if django passes tweetid
      endpoint += `/${this.state.dataset.tweetId}`;
    }

    fetch(endpoint)
      .then(response => {
        if (response.ok){
          return response.json()
        } else {
          throw new Error('Something went wrong!');
        }
      })
      .then(data => {
        this.setState({tweets: data});
        // dispatch({action: 'fetching tweets', tweets: data});
      })
      .catch(err => {
        console.log(err.message);
      })
  }

  //basically it's a form, so you could have used FormData
  //but it's just a field, so json is okay
  handleTweetAdd(e){
    e.preventDefault(); 
    let data = {content: this.state.value};
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
        let tweets = [newTweet, ...this.state.tweets];
        this.setState({tweets, value: ''});
        // dispatch({action: 'adding new tweet', newTweet});
      })
      .catch(err => {
        console.log(err);
      })
  }

  handleRetweet(id){
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
      let tweets = [newTweet, ...this.state.tweets];
      this.setState({tweets});
      // dispatch({action: 'retweeting', newTweet});
    }).catch(err => {
      console.log(err);
    })
  }

  handleLikeClick(id){
    let action = this.state.tweets.find(tweet => tweet.id === id).likes.user_liked ? 'dislike' : 'like';
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
      let deepStateTweetsCopy = JSON.stringify(this.state.tweets);
      deepStateTweetsCopy = JSON.parse(deepStateTweetsCopy);
      // find the tweet, likes amount of which, are being changed
      let currentTweet = deepStateTweetsCopy.find(tweet => tweet.id === id);

      // changing original tweet
      currentTweet.likes.likes = newLikes; 
      currentTweet.likes.user_liked = !currentTweet.likes.user_liked;

      // but that's not it, cuz above we just handle the original tweet like changing, 
      // but what if that tweet was retweeted, then the tweet also can be found at a_tweet.original 
      // and we need to update the UI there as well; anyway the id is the same, so it's easy to do:
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
      this.setState({tweets: deepStateTweetsCopy})
      // dispatch({action: 'fetching tweets', tweets: deepStateTweetsCopy});

    }).catch(err => {
      console.log(err);
    })
  }

  handleTextArea(e){
    let value = e.target.value; 
    this.setState({value});
  }

  render(){
    return(
      // so, basically value={{...this.state}} doesn't make a deep copy, 
      // but the good thing is Im not changing state anywhere else but here
      <UserContext.Provider 
        value={{
          ...this.state, 
          handleLikeClick: this.handleLikeClick, 
          handleTweetAdd: this.handleTweetAdd, 
          handleRetweet: this.handleRetweet, 
          handleTextArea: this.handleTextArea,
        }}
      >

        {this.props.children}
      </UserContext.Provider>
    )
  }
}

export default UserContextProvider;