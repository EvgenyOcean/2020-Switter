import React from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function Profile(props) {
  let username = props.dataset.feedOwner || props.dataset.username;

  return (
    <Row>
      <Col xs={10} lg={8} className="mx-auto mb-5 px-0 bg-primary">
        Showing tweets of &gt;&gt; <span className="text-white">{username}</span>
      </Col>
    </Row>
  );
}

export default Profile;