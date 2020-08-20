import React, {useContext} from 'react';
import { UserContext } from '../context';

import CreateTweetForm from '../components/CreateTweetForm';
import Tweet from '../components/Tweet';
import Profile from '../components/Profile';
import Pagination from '../components/Pagination';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

function Home(props) {
  let {
    dataset, handleLikeClick, 
    handleTweetAdd, handleTextArea, 
    value, tweets, count, 
    tweetsPerPage, openModal
  } = useContext(UserContext);

  let content = (
    <>
      <Profile dataset={dataset}/>
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
            handleLikeClick={handleLikeClick}
            dataset={dataset}
            openModal={openModal}
          /> 
        )}
      </Row>
      {count > tweetsPerPage && <Pagination />}
    </>
  )

  // may be deleted
  let login = <div>Hello, thanks for jumping in. Please, consider logging in to see the content!</div>

  return (
    <Container>
      {dataset.username ? content : login}
    </Container>
  );
}

export default Home;