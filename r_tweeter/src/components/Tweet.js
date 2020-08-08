import React from 'react';

import styled from 'styled-components';

import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

function Tweet(props) {

  let tweet = props.tweet; 
  let original = props.tweet.original;

  return (
    <Col xs={10} lg={8} className="mx-auto border border-success py-3 mb-3">
      <div className='media'>
        <div className="media-body">
          <h5 className="mt-0">Media heading</h5>
          {tweet.id} == {tweet.content}

          {original && <div className="media mt-3 ml-5 border border-primary p-3 mb-3">
            <div className="media-body">
              <h5 className="mt-0">Parent Heading</h5>
              {original.content}
            </div>
            <ButtonGroup aria-label="Basic example">
              <StyledButton variant={original.likes.user_liked ? 'info' : 'primary'} onClick={()=>{
                props.handleLikeClick(original.id)
              }}>Like {original.likes.likes}</StyledButton>
              <StyledButton variant="success" onClick={props.handleRetweet.bind(null, original.id)}>Retweet</StyledButton>
            </ButtonGroup>
          </div>}
          
        </div>
        <ButtonGroup aria-label="Basic example">
          <StyledButton variant={tweet.likes.user_liked ? 'info' : 'primary'} onClick={()=>{props.handleLikeClick(tweet.id)}}>Like {tweet.likes.likes}</StyledButton>
          <StyledButton variant="success" onClick={props.handleRetweet.bind(null, tweet.id)}>Retweet</StyledButton>
        </ButtonGroup>
      </div>
    </Col>
  );
}

const StyledButton = styled(Button)`
  // background-color: red; 
`

export default Tweet;
