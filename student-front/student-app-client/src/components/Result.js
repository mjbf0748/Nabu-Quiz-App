import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { withRouter } from 'react-router-dom';
import { invokeApig} from '../libs/awsLib';

function Result(props) {

  return (
    <ReactCSSTransitionGroup
      className="container result"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}
    >
      <div>
        You scored: <strong>100</strong>%!
      </div>
      <div>
        <button onclick="window.location='http://www.google.com';">Start Over</button>
      </div>
    </ReactCSSTransitionGroup>
  );

}



Result.propTypes = {
  quizResult: React.PropTypes.string.isRequired,
};
export default withRouter(Result);