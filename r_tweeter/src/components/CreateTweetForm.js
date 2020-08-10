import React from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function CreateTweetForm(props) {
  let value = props.value; 
  return (
    <Row>
      <Col xs={10} lg={8} className="mx-auto mb-5 px-0">
        <Form onSubmit={props.handleTweetAdd}>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Create New Tweet:</Form.Label>
            <Form.Control as="textarea" rows="3" value={value} onChange={(e)=>{
              // let value = e.target.value; 
              // dispatch({action: 'changing textarea', value})
              props.handleTextArea(e);
            }} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

export default CreateTweetForm;