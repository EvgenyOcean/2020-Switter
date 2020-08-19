import React, {useContext} from 'react';
import { UserContext } from './context';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Users from './pages/Users';

function App(props) {
  let {dataset: {page}} = useContext(UserContext); 

  return(
    <>
      <Navbar />
      {page === 'detail' && <Detail />}
      {page === 'users' && <Users />}
      {(page === 'home' || page === 'user')  && <Home />}
    </>
  )
}

export default App;
