import React, {useContext} from 'react';
import Tweet from '../components/Tweet';
import { UserContext } from '../context';

function Detail(props) {

  let {
    dataset, tweets, 
    handleLikeClick,
    handleDeleteClick, openModal,
  } = useContext(UserContext);

  let toRender = tweets.length ? <Tweet
    tweet={tweets[0]} 
    openModal={openModal}
    handleLikeClick={handleLikeClick}
    handleDeleteClick={handleDeleteClick}
    dataset={dataset}
  /> : <div>Loading</div>

  return toRender;
}

export default Detail;