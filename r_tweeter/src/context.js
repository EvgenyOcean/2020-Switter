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
        tweetId: props.tweetId,
        feedOwner: props.feedOwner
      },
      value: '', //maybe later on value will be somewhere else ? 
      tweets: [],
      prev: '', 
      next: '', 
      count: 0,
      tweetsPerPage: 15,
    }
    this.handleRetweet = this.handleRetweet.bind(this);
    this.handleTweetAdd = this.handleTweetAdd.bind(this);
    this.handleLikeClick = this.handleLikeClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleTextArea = this.handleTextArea.bind(this);
    this.fetchSomeTweets = this.fetchSomeTweets.bind(this);
  }

  
  componentDidMount(){
    if (this.state.dataset.username){
      this.fetchSomeTweets();
    }
  }
  
  fetchSomeTweets(forceEndpoint=null){
    // default endpoint for home page
    let endpoint = '/api/tweets';
    
    // forceEndpoint servers to paginate
    if (!forceEndpoint){
      if (this.state.dataset.page === 'user'){
        // if django passes username
        endpoint += `/?username=${this.state.dataset.feedOwner}`;
      } else if (this.state.dataset.page === 'detail'){
        // if django passes tweetid
        endpoint += `/${this.state.dataset.tweetId}`;
      }
    } else {
      // next or prev btn click
      endpoint = forceEndpoint;
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
        // temp, for pagination
        if (data.results){
          let prev = data.previous;
          let next = data.next; 
          let count = data.count;
          data = data.results
  
          if (!Array.isArray(data)){
            this.setState({tweets: [data]});
          } else {
            this.setState({tweets: data, prev, next, count});
          };
        } else {
          // the condition below will be met, if detailed view requested a tweet
          if (!Array.isArray(data)){
            this.setState({tweets: [data]});
          } else {
            this.setState({tweets: data});
          };
        }
        window.scrollTo(0,0);
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
        'X-CSRFToken': getCookie('csrftoken'),
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
      })
      .catch(err => {
        console.log(err);
      })
  }

  // you need to fix that, cuz when you're retweing someone else's tweets 
  // they're prepending to someone else's feed which is bad
  handleRetweet(id){
    let action = 'retweet';
    fetch(`/api/tweets/tweet-action/${id}`, {
      method: "POST", 
      headers: {
        'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken'),
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
      // what it means is we need to prepend new retweet only if its user's own feed
      // this is true only if a user on his home page
      if (this.state.dataset.page === 'home'){
        let tweets = [newTweet, ...this.state.tweets];
        this.setState({tweets});
      } else {
        // paste a message that the tweet was retweeted; 
        console.log('Tweet was successfully retweeted!');
      }
    }).catch(err => {
      console.log(err);
    })
  }

  handleDeleteClick(id){
    let action = 'delete'; 
    fetch(`/api/tweets/${id}`, {
      method: "DELETE", 
      headers: {
        'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({action}), 
    }).then(response => {
      if (response.ok){
        return response.json()
      }else {
        throw new Error('something went wrong!');
      }
    })
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(err);
    })
  }

  handleLikeClick(id){
    // toDo: I should consider reduce the amount of ifs statements and make a solid single logic
    // works if we have all the tweets in the state
    let action; 
    let updatingTweet; 
    let theTweet;
    if (this.state.tweets.length > 1){
      // we have many tweets
      // but even though we have many tweets, we could have a retweet
      // which is not in the state, and we need to like the tweet anyway!

      if (this.state.tweets.find(tweet => tweet.id === id)){
        // maybe we're liking our own tweet
        theTweet = this.state.tweets.find(tweet => tweet.id === id);
        action = theTweet.likes.user_liked ? 'dislike' : 'like';
      } else {
        // otherwise, we're liking one's original tweet
        theTweet = this.state.tweets.find(tweet => {
          if (tweet.original){
            return tweet.original.id === id
          } 
          return false;
        });
        action = theTweet.original.likes.user_liked ? 'dislike' : 'like';
      }

    } else {
      // we have only one tweet in the state
      if (this.state.tweets[0].id === id){
        // liking the main tweet
        action = this.state.tweets[0].likes.user_liked ? 'dislike' : 'like';
        updatingTweet = 'main';
      } else {
        // liking the parent tweet
        action = this.state.tweets[0].original.likes.user_liked ? 'dislike' : 'like';
        updatingTweet = 'original';
      }
    }


    fetch(`/api/tweets/tweet-action/${id}`, {
      method: "POST", 
      headers: {
        'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken'),
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

      // if there's only one tweet in the state, there's nothing left to update but itself
      if (this.state.dataset.page === 'detail'){
        if (updatingTweet === 'main'){
          deepStateTweetsCopy[0].likes.likes = newLikes; 
          deepStateTweetsCopy[0].likes.user_liked = !deepStateTweetsCopy[0].likes.user_liked; 
        } else {
          deepStateTweetsCopy[0].original.likes.likes = newLikes; 
          deepStateTweetsCopy[0].original.likes.user_liked = !deepStateTweetsCopy[0].original.likes.user_liked; 
        }
        this.setState({tweets: deepStateTweetsCopy})
        return;
      }

      // find the tweet, likes amount of which, are being changed
      let currentTweet;
      // it can be original tweet itself in one place
      if (deepStateTweetsCopy.find(tweet => tweet.id === id)){
        currentTweet = deepStateTweetsCopy.find(tweet => tweet.id === id);
        //change original tweet's likes
        currentTweet.likes.likes = newLikes; 
        currentTweet.likes.user_liked = !currentTweet.likes.user_liked;

        // I have to check if the tweet is also somewhere else on the page: 
        let currentTweetAsOriginal = deepStateTweetsCopy.filter(tweet => {
          if (tweet.original){
            return tweet.original.id === id;
          };
          return false;
        });

        // if there're any
        if (currentTweetAsOriginal){
          for (let tweetContainsOriginal of currentTweetAsOriginal){
            tweetContainsOriginal.original.likes.likes = newLikes; 
            tweetContainsOriginal.original.likes.user_liked = !tweetContainsOriginal.original.likes.user_liked; 
          }
        }
      } else {
        // or it can be found at .original in multiple places
        let currentTweetAsOriginal = deepStateTweetsCopy.filter(tweet => {
          if (tweet.original){
            return tweet.original.id === id;
          };
          return false;
        });

        // if there're any
        if (currentTweetAsOriginal){
          for (let tweetContainsOriginal of currentTweetAsOriginal){
            tweetContainsOriginal.original.likes.likes = newLikes; 
            tweetContainsOriginal.original.likes.user_liked = !tweetContainsOriginal.original.likes.user_liked; 
          }
        }
      }
    
      // finally, rerendering the updated tweets
      this.setState({tweets: deepStateTweetsCopy})
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
          handleDeleteClick: this.handleDeleteClick,
          fetchSomeTweets: this.fetchSomeTweets,
        }}
      >

        {this.props.children}
      </UserContext.Provider>
    )
  }
}

export default UserContextProvider;


// OTHER FUNCTIONS, ALSO GOOD FOR UTILS AND STUFF
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}