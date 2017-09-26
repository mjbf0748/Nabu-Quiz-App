import React, { Component } from 'react';
import './App.css';
import Routes from './Routes';
import {
  withRouter,
  Link
} from 'react-router-dom';
import {
  Nav,
  Navbar,
  NavItem,
  NavDropdown,
  MenuItem,
} from 'react-bootstrap';
import RouteNavItem from './components/RouteNavItem';
import { CognitoUserPool, } from 'amazon-cognito-identity-js';
import config from './config.js';
import AWS from 'aws-sdk';

class App extends Component {

  constructor(props) {
  super(props);

this.state = {
  userToken: null,
  isLoadingUserToken: true,
  };
}

updateUserToken = (userToken) => {
  this.setState({
    userToken: userToken
  });
}

async componentDidMount() {
  const currentUser = this.getCurrentUser();

  if (currentUser === null) {
    this.setState({isLoadingUserToken: false});
    return;
  }

  try {
    const userToken = await this.getUserToken(currentUser);
    this.updateUserToken(userToken);
  }
  catch(e) {
    alert(e);
  }

  this.setState({isLoadingUserToken: false});
}

getCurrentUser() {
  const userPool = new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID
  });
  return userPool.getCurrentUser();
}

getUserToken(currentUser) {
  return new Promise((resolve, reject) => {
    currentUser.getSession(function(err, session) {
      if (err) {
          reject(err);
          return;
      }
      resolve(session.getIdToken().getJwtToken());
    });
  });
}

handleNavLink = (event) => {
  event.preventDefault();
  this.props.history.push(event.currentTarget.getAttribute('href'));
}  

handleLogout = (event) => {
  const currentUser = this.getCurrentUser();

  if (currentUser !== null) {
    currentUser.signOut();
  }

  if (AWS.config.credentials) {
  AWS.config.credentials.clearCachedId();
}

  this.updateUserToken(null);

  this.props.history.push('/login');
}

  handleNavLink = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }
  render() {
    const childProps = {
      userToken: this.state.userToken,
      updateUserToken: this.updateUserToken,
    };

    return ! this.state.isLoadingUserToken
    &&
    (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Nabu</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
            { this.state.userToken
               ?[<NavItem onClick={this.handleLogout}>Logout</NavItem>,
 
               <NavDropdown eventKey={3} title="SAT" id="basic-nav-dropdown" value="SAT">
                  <MenuItem eventKey={3.1} href='/SATmath'>Math</MenuItem>
                  <MenuItem eventKey={3.2} href='/SATreadingwriting'>Reading/Writing</MenuItem>
                 </NavDropdown>,
               <NavDropdown eventKey={4} title="ACT" id="basic-nav-dropdown">
                  <MenuItem eventKey={4.1} href='/ACTmath'>Math</MenuItem>
                  <MenuItem eventKey={4.2} href='/ACTenglish'>English</MenuItem>
                </NavDropdown> ]
             
              : [ <RouteNavItem key={1} onClick={this.handleNavLink} href="/">Signup</RouteNavItem>,
                  <RouteNavItem key={2} onClick={this.handleNavLink} href="/login">Login</RouteNavItem> ] }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);
