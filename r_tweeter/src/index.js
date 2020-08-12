import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import UserContextProvider from './context';

// need to get an element first, and pass it to a vatiable
// to get its dataset values
// to let context know at what endpoint should it fetch
let homePage = document.getElementById('root');

// homePage will be null if it's login or register
// cuz django handles registration and login just yet
if (homePage){
  ReactDOM.render(
    // we should consider moving context to the App, cuz there're some component
    // which don't need the context value at all
    <UserContextProvider {...homePage.dataset}>
      <App />
    </UserContextProvider>,
    homePage
  );
}



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
