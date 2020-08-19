import React from 'react';

function User(props) {
  let user = props.user;
  return (
    <div className="card mb-5 border-primary">
      <div className="card-body">
        <a href={'/' + user.username}><h5 className="mt-0 mb-2">@{user.username}</h5></a>
        <li className="media">
          <img src={user.profile.avatar} className="mr-3" alt="avatar" />
          <div className="media-body">
            <p>Full Name: {user.first_name + ' ' + user.last_name}</p>
            <p>Location: {user.profile.location}</p>
            <p>Bio: {user.profile.bio}</p>
          </div>
        </li>
      </div>
    </div>
  );
}

export default User;