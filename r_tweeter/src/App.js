import React, {useContext} from 'react';
import { UserContext } from './context';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Users from './pages/Users';
import ErrorPage from './pages/ErrorPage';
import ModalRetweet from './components/ModalRetweet';

function App(props) {
  let {dataset: {page, message}, show, 
      closeModal, retweetingTweet,
      handleRetweet,} = useContext(UserContext); 
  

  return(
    <>
      <Navbar />
      {page === 'detail' && <Detail />}
      {page === 'users' && <Users />}
      {(page === 'home' || page === 'user')  && <Home />}
      {page === 'error' && <ErrorPage message={message}/>}
      <ModalRetweet show={show} onHide={closeModal} retweetingtweet={retweetingTweet} handleRetweet={handleRetweet}/>
    </>
  )
}

export default App;
