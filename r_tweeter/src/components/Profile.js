import React, {useEffect, useState} from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Profile(props) {
  let dataset = props.dataset;
  let username = dataset.feedOwner || dataset.username;
  const [profileData, setProfileData] = useState({});

  const handleFollow = (e) => {
    fetch(`api/accounts/adjust-followers/${dataset.feedOwner}/`, {
      method: "POST", 
      headers: {
        'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken'),
      },
    })
      .then(response => {
        if (response.ok) return response.json();
        else {throw new Error('Something went wrong!');};
      })
      .then(data => {
        setProfileData(data);
      })
      .catch(err => {console.log(err)})
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = new FormData(e.target);
    fetch(`api/accounts/${username}/`, {
      method: 'POST', 
      headers: {
        'HTTP_X_REQUESTED_WITH': 'XMLHttpRequest',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': getCookie('csrftoken'),
      }, 
      body: data,
    })
    .then(response => {
      if (response.ok) return response.json();
      else {throw new Error('Something went wrong!');};
    })
    .then(data => {
      console.log(data);
    })
    .catch(err => {console.log(err)}) 
  }

  useEffect(() => {
    fetch(`api/accounts/${username}/`)
      .then(response => {
        if (response.ok) return response.json();
        else {throw new Error('Something went wrong!');};
      })
      .then(data => {
        setProfileData(data);
      })
      .catch(err => {console.log(err)})
  }, [username])


  if (profileData.user){
    // profileData.followerings.followers.push('evgenyocean');
    let isFollower = profileData.followerings.followers.includes(dataset.username);

    let editableInfo = (
      <Col xs={5} lg={4} className="px-0 bg-primary">
        <Form className="px-2" onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" name="username" defaultValue={profileData.user.username}/>
          </Form.Group>

          <Form.Group controlId="formBasicFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" name="firstName" defaultValue={profileData.user.first_name}/>
          </Form.Group>
          
          <Form.Group controlId="formBasicLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" name="lastName" defaultValue={profileData.user.last_name}/>
          </Form.Group>
          
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" name="email" defaultValue={profileData.user.email}/>
          </Form.Group>

          <Form.Group controlId="formBasicBio">
            <Form.Label>Bio</Form.Label>
            <Form.Control type="text" name="bio" defaultValue={profileData.bio}/>
          </Form.Group>

          <Form.Group controlId="formBasicLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" name="location" defaultValue={profileData.location}/>
          </Form.Group>


          <Button variant="info" type="submit">
            Submit
          </Button>
        </Form>
      </Col>
    )

    let info = (
      <Col xs={5} lg={4} className="px-0 bg-primary">
        Showing tweets of &gt;&gt; <span className="text-white">{username}</span>
        <div className="names">
          {profileData.user.first_name} {profileData.user.last_name} 
        </div>

        {profileData.bio && <div className="bio">{profileData.bio}</div>}
        {profileData.location && <div className="location">{profileData.location}</div>}
        {(dataset.page === 'user') && 
          <Button variant={isFollower ? 'danger' : 'success'} onClick={handleFollow}>
            {isFollower ? 'Unfollow' : 'Follow'}
          </Button>
        }
      </Col>
    )

    return (
      <Row className="d-flex justify-content-center mb-5">
        <Col xs={5} lg={4} className="px-0 bg-primary">
          <div className="followers">Followers: {profileData.followerings.followers.length}</div>
          <div className="following">Following: {profileData.followerings.following.length}</div>
        </Col>
        {dataset.page === 'home' ? editableInfo : info}
      </Row>
    );
  }else {
    return <div>Loading...</div>
  }
}

export default Profile;


// OTHER FUNCTIONS, CONSIDER CREATING UTILS.JS
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}