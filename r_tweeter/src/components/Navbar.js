import React, {useContext} from 'react';
import {UserContext} from '../context';

import NavbarComponent from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function Navbar(props) {
  let {dataset} = useContext(UserContext);

  return (
    <NavbarComponent bg="primary" variant="dark" className="mb-3">
      <NavbarComponent.Brand href="#home">Dj Tweet</NavbarComponent.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="/users">Users</Nav.Link>
      </Nav>
      <Nav>
        {
          dataset.username ?
          <Nav.Link href="/logout">Logout [{dataset.username}]</Nav.Link> 
          :
          <>
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/register">Register</Nav.Link>
          </>
        }
      </Nav>
    </NavbarComponent>
  );
}

export default Navbar;