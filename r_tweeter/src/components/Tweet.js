import React from 'react';

import styled from 'styled-components';

import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

function Tweet(props) {
  // This component needs: 
  // 1. dataset
  // 2. tweet itself
  // 3. handleLikeClick
  // 4. handleDeleteClick

  let dataset = props.dataset; 
  let tweet = props.tweet; 
  let original = props.tweet.original;
  let openModal = props.openModal;

  const handleRetweet = (id) => {
    openModal(id);
  }
  
  return (
    <Col xs={10} lg={8} className="mx-auto border border-success py-3 mb-3">
      <div className='media'>
        <img src={tweet.owner.avatar} className="mr-3" alt="avatar" />
        <div className="media-body">
          <div>
            <a href={'/' + tweet.owner.username} className="mt-0 text-info">{tweet.owner.username}</a>
          </div>
          {tweet.content}
          {original && 
            <>          
              <div className="media mt-3 border border-primary p-3 mb-3">
                <img src={original.owner.avatar} className="mr-3" alt="avatar" />
                <div className="media-body d-flex flex-column align-items-start">
                  <div>
                    <a href={'/' + original.owner.username} className="mt-0 text-info">{original.owner.username}</a>
                  </div>
                  {original.content}
                  <ButtonGroup aria-label="Basic example" className="mt-1">
                    <StyledButton variant={original.likes.user_liked ? 'info' : 'primary'} size="sm" onClick={()=>{
                      props.handleLikeClick(original.id)
                    }}>Like {original.likes.likes}</StyledButton>
                    <StyledButton variant="success" onClick={()=> {handleRetweet(original.id)}}>Retweet</StyledButton>
                    {(dataset.page === 'home' || dataset.page === 'user') && <a href={'/' + tweet.original.id} className="btn btn-outline-info">Comments</a>}
                  </ButtonGroup>
                </div>
              </div>
            </>}    
        </div>
      </div>
      <ButtonGroup aria-label="Basic example">
        <StyledButton variant={tweet.likes.user_liked ? 'info' : 'primary'} onClick={()=>{props.handleLikeClick(tweet.id)}}>Like {tweet.likes.likes}</StyledButton>
        <StyledButton variant="success" onClick={()=> {handleRetweet(tweet.id)}}>Retweet</StyledButton>
        {(dataset.page === 'home' || dataset.page === 'user') && <a href={'/' + tweet.id} className="btn btn-outline-info">Commments</a>}
        {(dataset.page === 'detail') && (tweet.owner.username === dataset.username) && <StyledButton variant="danger" onClick={props.handleDeleteClick.bind(null, tweet.id)}>Delete</StyledButton>}
      </ButtonGroup>
    </Col>
  );
}

const StyledButton = styled(Button)`
  // background-color: red; 
`

export default Tweet;
