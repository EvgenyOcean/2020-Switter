import React, {useContext} from 'react';
import Tweet from '../components/Tweet';
import { UserContext } from '../context';

function Detail(props) {

  let {
    tweets, handleRetweet, 
    handleLikeClick,
  } = useContext(UserContext);

  console.log(tweets[0]);

  let toRender = tweets.length ? <Tweet
    tweet={tweets[0]} 
    handleRetweet={handleRetweet} 
    handleLikeClick={handleLikeClick}
  /> : <div>Loading</div>

  return toRender;
}

export default Detail;