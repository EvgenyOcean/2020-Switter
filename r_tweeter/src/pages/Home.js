import React, {useState, useEffect} from 'react';
import Feed from '../components/Feed';
import CreateTweetForm from '../components/CreateTweetForm';

import Container from 'react-bootstrap/Container';

function Home(props) {

  const [tweets, setTweets] = useState([]); 

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
        console.log(data);
        setTweets(data);
      })
      .catch(err => {
        console.log(err.message);
      })
  }, [])

  const handleTweetAdd = (value, e) => {
    console.log(value);
    e.preventDefault(); 
    // one server response is ok 
    let tempTweet = {
      content: value, 
      id: 123, 
      likes: {
        likes: 15, 
        user_liked: false,
      }
    }
    setTweets(prevState => [tempTweet ,...prevState])
  }

  return (
    <Container>
      <CreateTweetForm handleTweetAdd={handleTweetAdd}/>
      <Feed tweets={tweets}/>
    </Container>
  );
}

export default Home;