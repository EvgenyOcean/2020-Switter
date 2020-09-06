import React, {useEffect, useState} from 'react';

import styled from 'styled-components';

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
      if (response.ok){
        response.json().then(
          data => {
            let firstProp = Object.getOwnPropertyNames(data)[0];
            props.addNotification(data[firstProp], 'success');
          }
        )
        .catch(err => {console.log(err)})
      } else {
        response.json().then(
          data => {
            let firstErr = Object.getOwnPropertyNames(data)[0];
            props.addNotification(data[firstErr][0], 'danger');
          }
        )
        .catch(err => {console.log(err)}) 
      };
    })
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
    let isFollower = profileData.followerings.followers.includes(dataset.username);

    let editableInfo = (
      <Col className="px-0 side right">
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
          
          {/* <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" name="email" defaultValue={profileData.user.email}/>
          </Form.Group> */}

          <Form.Group controlId="formBasicBio">
            <Form.Label>Bio</Form.Label>
            <Form.Control type="text" name="bio" defaultValue={profileData.bio}/>
          </Form.Group>

          <Form.Group controlId="formBasicLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" name="location" defaultValue={profileData.location}/>
          </Form.Group>

          <Form.Group controlId="formBasicFile"> 
            <Form.File id="formBasicFile" label="Change Avatar" name="avatar"/>
          </Form.Group>

          <Button variant="info" type="submit">
            Submit
          </Button>
        </Form>
      </Col>
    )

    let info = (
      <Col className="px-0 info side">
        <div className="username">@{profileData.user.username}</div>
        {profileData.user.first_name && 
          <>
            <div className="lable first-label">First name</div>
            <div className="piece first">{profileData.user.first_name}</div>
          </>
        }

        {profileData.user.last_name && 
          <>
            <div className="lable last-label">Last name</div>
            <div className="piece last">{profileData.user.last_name}</div>
          </>
        }

        {profileData.bio && 
          <>
            <div className="lable last-label">Bio</div>
            <div className="piece last">{profileData.bio}</div>
          </>
        }
        
        {profileData.location && 
          <>
            <div className="lable last-label">Location</div>
            <div className="piece last">{profileData.location}</div>
          </>
        }
        
        {(dataset.page === 'user') && 
          <Button variant={isFollower ? 'danger' : 'success'} onClick={handleFollow}>
            {isFollower ? 'Unfollow' : 'Follow'}
          </Button>
        }
      </Col>
    )

    return (
      <StyledProfile className="mb-5">
        <Col className="px-0 side left">
          <img src={profileData.avatar} alt="Avatar"/>
          <div className="followers">Followers: {profileData.followerings.followers.length}</div>
          <div className="following">Following: {profileData.followerings.following.length}</div>
        </Col>
        {dataset.page === 'home' ? editableInfo : info}
      </StyledProfile>
    );
  }else {
    return <div>Loading...</div>
  }
}

export default Profile;

const StyledProfile = styled(Row)`
  display: flex; 
  background: #dddddd;
  max-width: 700px;
  margin: auto;
  padding: 1rem;
  border-radius: 1rem;
  gap: 1rem;

  .side{
    flex: 1;
    padding: 0.5rem;
  }

  .left{
    background: #00000033;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; 


    .followers{
      padding: 0.3rem 0.7rem;
      background: var(--info);
      border-radius: 0.2rem;
      margin-bottom: 0.3rem;
      color: white;
    }

    .following{
      padding: 0.3rem 0.7rem;
      background: var(--info);
      border-radius: 0.2rem;
      margin-bottom: 0.3rem;
      color: white;
    }
  }

  .right{
    .form-group label{
      color: var(--info);
      font-weight: 600;
    }
  }

  .info{
    .username{
      font-weight: 700;
      text-align: center;
      font-size: 1.4rem;
      color: var(--info);
      margin-bottom: 1rem;
    }

    .lable {
      color: var(--info);
      font-weight: 500;
    }

    .piece {
      background: #ffffff;
      padding: 0.2rem;
      border-radius: 0.2rem;
      margin-bottom: 1rem;
    }
  }
`


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