import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import './Home.css';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="lander">
          <p><img src={require('../Nabu_Logo.png')} alt='Logo'/></p>
          <h1>ACT/SAT Prep</h1>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);