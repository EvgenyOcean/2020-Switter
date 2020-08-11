import React, {useContext} from 'react';
import { UserContext } from '../context';

import CreateTweetForm from '../components/CreateTweetForm';
import Tweet from '../components/Tweet';
import Profile from '../components/Profile';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

function Home(props) {
  let {
    dataset, handleLikeClick, 
    handleRetweet, handleTweetAdd, 
    handleTextArea, value, tweets,
  } = useContext(UserContext);

  let content = (
    <>
      <Profile username={dataset.feedOwner}/>
      {dataset.canTweet === 'true' && 
      <CreateTweetForm 
        value={value} 
        handleTextArea={handleTextArea} 
        handleTweetAdd={handleTweetAdd}
      />}
      <Row>
        {tweets.map(tweet => 
          <Tweet
            key={tweet.id} 
            tweet={tweet} 
            handleRetweet={handleRetweet} 
            handleLikeClick={handleLikeClick}
          /> 
        )}
      </Row>
    </>
  )

  let login = <div>Hello, thanks for jumping in. Please, consider loging in to see the content!</div>

  return (
    <Container>
      {dataset.username ? content : login}
    </Container>
  );
}

export default Home;