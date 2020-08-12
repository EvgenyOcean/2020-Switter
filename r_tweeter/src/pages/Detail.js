import React, {useContext} from 'react';
import Tweet from '../components/Tweet';
import { UserContext } from '../context';

function Detail(props) {

  let {
    dataset, tweets, handleRetweet, 
    handleLikeClick, handleDeleteClick,
  } = useContext(UserContext);

  let toRender = tweets.length ? <Tweet
    tweet={tweets[0]} 
    handleRetweet={handleRetweet} 
    handleLikeClick={handleLikeClick}
    handleDeleteClick={handleDeleteClick}
    dataset={dataset}
  /> : <div>Loading</div>

  return toRender;
}

export default Detail;