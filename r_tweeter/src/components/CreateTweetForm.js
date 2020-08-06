import React, {useState} from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function CreateTweetForm(props) {
  const [value, setValue] = useState('');

  const handleTextChange = (e) => {
    setValue(e.target.value);
  }

  return (
    <Row>
      <Col xs={10} lg={8} className="mx-auto mb-5 px-0">
        <Form onSubmit={props.handleTweetAdd.bind(null, value)}>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Create New Tweet:</Form.Label>
            <Form.Control as="textarea" rows="3" value={value} onChange={handleTextChange} />
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