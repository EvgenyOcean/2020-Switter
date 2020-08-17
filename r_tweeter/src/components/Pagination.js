import React, {useContext} from 'react';
import {UserContext} from '../context';

import Paginator from 'react-bootstrap/Pagination'; 

function Pagination(props) {
  let {next, prev, count, fetchSomeTweets} = useContext(UserContext) 
  console.log(next);

  return (
    <div className="d-flex justify-content-center">
      <Paginator>
        <Paginator.First />
        <Paginator.Prev />
        <Paginator.Item active>{1}</Paginator.Item>
        <Paginator.Next onClick={()=> {fetchSomeTweets('http://localhost:8000/api/tweets/?page=2&username=detective')}} />
        <Paginator.Last />
      </Paginator>
    </div>
  );
}

export default Pagination;
