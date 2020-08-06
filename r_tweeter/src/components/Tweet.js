import React, {useState} from 'react';

import styled from 'styled-components';

import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

function Tweet(props) {
  const [userLiked, setUserLiked] = useState(props.tweet.likes.user_liked);
  const [likes, setLikes] = useState(props.tweet.likes.likes);

  //feature toDo: 
  //1. If user liked the tweet => change tweet color and next action to dislike 
  //2. If user is not register => configure backend handling it
  const handleLikeClick = () => {
    if (props.tweet.likes.user_liked){
      //fetch with dislike action
      //setLikes + 1
    } else {
      //fetch to like action
      //setLikes - 1
    }
  }

  return (
    <Col xs={10} lg={8} className="mx-auto border border-success py-3 mb-3">
      {props.tweet.id} = {props.tweet.content}
      <ButtonGroup aria-label="Basic example">
        <StyledButton variant={userLiked ? 'info' : 'primary'} onClick={handleLikeClick}>Like {likes}</StyledButton>
        <StyledButton variant="success">Retweet</StyledButton>
      </ButtonGroup>
    </Col>
  );
}

const StyledButton = styled(Button)`
  // background-color: red; 
`

export default Tweet;
