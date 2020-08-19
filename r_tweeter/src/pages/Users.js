import React, { useEffect, useState } from 'react';
import User from '../components/User';
import Container from 'react-bootstrap/Container';

function Users(props) {

  const [users, setUsers] = useState([]);

  useEffect(()=>{
    fetch('api/accounts/users_list')
      .then(response => {
        if (response.ok){
          return response.json();
        } else {
          throw new Error('something went wrong!');
        }
      })
      .then(data => {
        console.log(data);
        setUsers(data);
      })
      .catch(err => {console.log(err);})
  }, [])

  return (
    <Container>
      <h2 className="text-center">Present all the registered users so far</h2>
      <ul className="list-unstyled">
        {users.map(user => <User key={user.username} user={user} />)}
      </ul>
    </Container>
  );
}

export default Users;