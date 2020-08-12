import React from 'react';

import styled from 'styled-components';

import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

function Tweet(props) {
  // This component needs: 
  // 1. dataset
  // 2. tweet itself
  // 3. handleRetweet, handleLikeClick
  // 4. handleDeleteClick

  let dataset = props.dataset; 
  let tweet = props.tweet; 
  let original = props.tweet.original;
  
  return (
    <Col xs={10} lg={8} className="mx-auto border border-success py-3 mb-3">
      <div className='media'>
        <div className="media-body">
          <div>
            <a href={'/' + tweet.owner} className="mt-0 text-info">{tweet.owner}</a>
          </div>
          {tweet.id} == {tweet.content}

          {original && <div className="media mt-3 ml-5 border border-primary p-3 mb-3">
            <div className="media-body">
              <div>
                <a href={'/' + original.owner} className="mt-0 text-info">{original.owner}</a>
              </div>
              {original.content}
            </div>
            <ButtonGroup aria-label="Basic example">
              <StyledButton variant={original.likes.user_liked ? 'info' : 'primary'} onClick={()=>{
                props.handleLikeClick(original.id)
              }}>Like {original.likes.likes}</StyledButton>
              <StyledButton variant="success" onClick={props.handleRetweet.bind(null, original.id)}>Retweet</StyledButton>
              {(dataset.page === 'home' || dataset.page === 'user') && <a href={'/' + tweet.original.id} className="btn btn-outline-info">Comments</a>}
            </ButtonGroup>
          </div>}    
        </div>
        <ButtonGroup aria-label="Basic example">
          <StyledButton variant={tweet.likes.user_liked ? 'info' : 'primary'} onClick={()=>{props.handleLikeClick(tweet.id)}}>Like {tweet.likes.likes}</StyledButton>
          <StyledButton variant="success" onClick={props.handleRetweet.bind(null, tweet.id)}>Retweet</StyledButton>
          {(dataset.page === 'home' || dataset.page === 'user') && <a href={'/' + tweet.id} className="btn btn-outline-info">Commments</a>}
          {(dataset.page === 'detail') && (tweet.owner === dataset.username) && <StyledButton variant="danger" onClick={props.handleDeleteClick.bind(null, tweet.id)}>Delete</StyledButton>}
        </ButtonGroup>
      </div>
    </Col>
  );
}

const StyledButton = styled(Button)`
  // background-color: red; 
`

export default Tweet;
