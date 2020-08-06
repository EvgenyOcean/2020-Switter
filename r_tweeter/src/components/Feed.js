import React from 'react';
import Tweet from './Tweet';

import Row from 'react-bootstrap/Row';

function Feed(props) {

  return (
    <Row>
      {props.tweets.map(el => <Tweet key={el.id} tweet={el} />)}
    </Row>
  );
}

export default Feed;