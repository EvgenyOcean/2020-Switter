import React, {useContext} from 'react';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Navbar from './components/Navbar';
import { UserContext } from './context';

function App(props) {
  let {dataset: {page}} = useContext(UserContext); 
  console.log(page); // home
  let componentToRender = page === 'detail' ? <Detail /> : <Home />;

  return(
    <>
      <Navbar />
      {componentToRender}
    </>
  )
}

export default App;
