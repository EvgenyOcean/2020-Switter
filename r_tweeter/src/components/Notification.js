import React from 'react';

import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function Notification(props) {
  return (
    <Container>
      <Row>
        <Col xs={10} lg={8} className="mx-auto px-0">
          <Alert variant={props.notVariant}>
            {props.notification}
          </Alert>
        </Col>
      </Row>
    </Container>
  );
}

export default Notification;