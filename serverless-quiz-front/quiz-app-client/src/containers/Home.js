import React, { Component } from 'react';
import './Home.css';
import {
  Button,
  Jumbotron
} from 'react-bootstrap';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="lander">
          <Jumbotron>
          <h1>Welcome to Nabu</h1>
          <p>An SAT/ACT Prep App</p>
          <p><Button href="/quiz/new">Create a Quiz</Button></p>
          </Jumbotron>
        </div>
      </div>
    );
  }
}

export default Home;