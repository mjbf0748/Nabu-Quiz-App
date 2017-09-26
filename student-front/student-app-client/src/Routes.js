import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppliedRoute from './components/AppliedRoute';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import UnauthenticatedRoute from './components/UnauthenticatedRoute';
import NotFound from './containers/NotFound';
import Home from './containers/Home';
import Login from './containers/Login';
import CreateAccount from './containers/CreateAccount';
import SATmath from './containers/displays/SATmath'
import SATreadingwriting from './containers/displays/SATreadingwriting'
import ACTmath from './containers/displays/ACTmath'
import ACTenglish from './containers/displays/ACTenglish'
import TimedQuiz from './containers/TimedQuiz'

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <AuthenticatedRoute path="/SATmath" exact component={SATmath} props={childProps}/>
    <AuthenticatedRoute path="/ACTmath" exact component={ACTmath} props={childProps}/>
    <AuthenticatedRoute path="/SATreadingwriting" exact component={SATreadingwriting} props={childProps}/>
    <AuthenticatedRoute path="/ACTenglish" exact component={ACTenglish} props={childProps}/>
    <AuthenticatedRoute path="/CreateAccount" exact component={CreateAccount} props={childProps}/>
    <AuthenticatedRoute path="/TimedQuiz/:id" exact component={TimedQuiz} props={childProps}/>

    
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
    
  </Switch>
);