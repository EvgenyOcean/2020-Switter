import React, {useContext, useState} from 'react';
import {UserContext} from '../context';

import Paginator from 'react-bootstrap/Pagination'; 

function Pagination(props) {
  const [current, setCurrent] = useState(1);
  let {next, prev, count, fetchSomeTweets, tweetsPerPage} = useContext(UserContext);
  let numberOfPages = Math.ceil(count / tweetsPerPage);
  
  const handleNextPrev = (e) => {
    let target = e.target.closest('[role="button"]');
    let endpoint = target.dataset.func === 'next' ? next : prev; 
    fetchSomeTweets(endpoint);
    if (target.dataset.func === 'next'){
      setCurrent(prevState => prevState + 1);
    } else {
      setCurrent(prevState => prevState - 1);
    }
  }

  const handleFirstLast = (e) => {
    e.preventDefault();
    let endpoint = next ? next : prev;
    let target = e.target.closest('[role="button"]');
    let whereTo = target.dataset.func === 'last' ? 'last' : 'first'; 

    if (whereTo === 'last'){
      // should have used regex, cuz the point being is 
      // whatever page was there it needs to be replaced
      // with numberOfPages
      let pageNum = endpoint[endpoint.indexOf('/?page=') + 7];
      endpoint = endpoint.replace(`/?page=${pageNum}`, `/?page=${numberOfPages}`);
    } else {
      // because we won't get /?page=1, instead it will be
      // just api/tweets/, so there's no point to append 1
      if (endpoint.includes('/?page')){
        let pageNum = endpoint[endpoint.indexOf('/?page=') + 7];
        endpoint = endpoint.replace(`/?page=${pageNum}`, `/?page=${1}`);
      } else {
        endpoint = prev;
      }
    }

    fetchSomeTweets(endpoint);

    if (whereTo === 'first'){
      setCurrent(1);
    } else {
      setCurrent(numberOfPages);
    }
  }

  return (
    <div className="d-flex justify-content-center">
      <Paginator>
        <Paginator.First onClick={handleFirstLast} data-func="first" disabled={current === 1} />
        <Paginator.Prev onClick={handleNextPrev} data-func="prev" disabled={prev === null} />
        <Paginator.Item active>{current}</Paginator.Item>
        <Paginator.Next onClick={handleNextPrev} data-func="next" disabled={next === null} />
        <Paginator.Last onClick={handleFirstLast} data-func="last" disabled={current === numberOfPages} />
      </Paginator>
    </div>
  );
}

export default Pagination;
