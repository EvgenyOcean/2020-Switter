import React from 'react';
import styled from 'styled-components';

import Container from 'react-bootstrap/Container'; 
import Button from 'react-bootstrap/Button';

function ErrorPage(props) {
  
  return (
    <StyledContainer>
      <h4>Oops! This page Could Not Be Found!</h4>
      <img src="/media/error.png" alt="Error"/>
      <p>&lt; {props.message} /&gt;</p>
      <Button href="/" variant="primary">Go to homepage</Button>
    </StyledContainer>
  );
}

export default ErrorPage;

const StyledContainer = styled(Container)`
  background-color: lightblue;
  display: flex; 
  flex-direction: column;
  align-items: center;
  justify-content: space-betweet;
  padding: 3rem 0;
  color: white;

  p{
    color: black;
  }
`