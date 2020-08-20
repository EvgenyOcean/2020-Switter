import React, {useState} from 'react';

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

function ModalRetweet(props) {
  // all you need you can take from the context brooo
  // console.log(props.retweetingtweet);
  let tweet = props.retweetingtweet;
  let handleRetweet = props.handleRetweet;
  let {show, onHide} = props;

  const [value, setValue] = useState('');

  let content = tweet ? (
    <Modal
    show={show}
    onHide={onHide}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Retweeting
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Add Retweet Comment:</Form.Label>
          <Form.Control as="textarea" rows="3" value={value} onChange={(e)=>{setValue(e.target.value)}} />
        </Form.Group>
      </Form>
      <div className='media'>
        <img src={tweet.owner.avatar} className="mr-3" alt="avatar" />
        <div className="media-body">
          <div>
            <a href={'/' + tweet.owner.username} className="mt-0 text-info">{tweet.owner.username}</a>
          </div>
          {tweet.content} 
        </div>
      </div>
    </Modal.Body>

    <Modal.Footer>
      <Button onClick={props.onHide} variant="danger">Cancel</Button>
      <Button onClick={() => {handleRetweet(tweet.id, value)}} variant="success">Retweet</Button>
    </Modal.Footer>
  </Modal>
  ) : null;

  return content;
}

export default ModalRetweet;