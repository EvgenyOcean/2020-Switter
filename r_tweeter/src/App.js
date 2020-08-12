import React, {useContext} from 'react';
import { UserContext } from './context';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Detail from './pages/Detail';

function App(props) {
  let {dataset: {page}} = useContext(UserContext); 

  return(
    <>
      <Navbar />
      {page === 'detail' && <Detail />}
      {(page === 'home' || page === 'user')  && <Home />}
    </>
  )
}

export default App;
