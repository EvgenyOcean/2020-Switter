import React from 'react';

function ParentTweet(props) {
  let original = props.tweet;
  if (original){
    return (
      <div className="media mt-3 ml-5 border border-primary p-3 mb-3">
        <div className="media-body">
          <h5 className="mt-0">Parent Heading</h5>
          {original.content}
        </div>
      </div>
    );
  }else{
    return null;
  }
}

export default ParentTweet;