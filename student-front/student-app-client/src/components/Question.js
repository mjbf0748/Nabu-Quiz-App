import React, { Component } from 'react';

function Question(props) {

  return (
    <h2 className="question">{props.title}</h2>
  );

}

Question.propTypes = {
  title: React.PropTypes.string.isRequired
};

export default Question;