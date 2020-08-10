import React, {useEffect, useContext, useState} from 'react';
import Tweet from '../components/Tweet';
import { UserContext } from '../context';

function Detail(props) {

  let {dataset: {tweetId}, tweets} = useContext(UserContext);
  console.log(tweetId, tweets); //50 {id: 50, content: null, likes: {…}, original: {…}}

  // useEffect(()=>{
  //   // console.log(tweetid);
  //   fetch(`api/tweets/${tweetid}`)
  //     .then(response => {
  //       if (response.ok){
  //         return response.json();
  //       } else {
  //         throw new Error('something went wrong');
  //       }
  //     })
  //     .then(data => {
  //       setTweet(data);
  //       console.log(data); 
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     })
  // }, [tweetid])

  return ( <div>Hello</div>
    // <Tweet
    //   tweet={tweet} 
    //   handleRetweet={handleRetweet} 
    //   handleLikeClick={handleLikeClick}
    // /> // handleRetweet is a good idea for HOC maybe...
  );
}

export default Detail;