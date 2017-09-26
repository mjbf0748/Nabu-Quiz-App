import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './CreateAccount.css';

class CreateAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmationCode: '',
      newUser: null,
    };
  }

  validateForm() {
    return 
      this.state.email.includes('@')
      && this.state.password.length > 0
      && this.state.firstName.length > 0
      && this.state.lastName.length > 0;
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  handleEChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  handleFChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  handleLChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  handlePChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  handleSubmit = async (event) => {
    event.preventDefault();

    this.setState({ isLoading: true });

    this.setState({ newUser: 'test' });

    this.setState({ isLoading: false });
  }

  handleConfirmationSubmit = async (event) => {
    event.preventDefault();

    this.setState({ isLoading: true });
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            value={this.state.confirmationCode}
            onChange={this.handleChange} />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={ ! this.validateConfirmationForm() }
          type="submit"
          isLoading={this.state.isLoading}
          text="Verify"
          loadingText="Verifying…" />
      </form>
    );
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="firstName" bsSize="large">
          <ControlLabel>First Name</ControlLabel>
          <FormControl
            value={this.state.firstName}
            onChange={this.handleFChange}
            type="text" />
        </FormGroup>
        <FormGroup controlId="lastName" bsSize="large">
          <ControlLabel>Last Name</ControlLabel>
          <FormControl
            value={this.state.lastName}
            onChange={this.handleLChange}
            type="text" />
        </FormGroup>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={this.state.email}
            onChange={this.handleEChange} />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            value={this.state.password}
            onChange={this.handlePChange}
            type="password" />
        </FormGroup>

        <LoaderButton
          block
          bsSize="large"
          disabled={ ! this.validateForm() }
          type="submit"
          isLoading={this.state.isLoading}
          text="Signup"
          loadingText="Signing up…" />
      </form>
    );
  }

  render() {
    return (
      <div className="Signup">
        { this.state.newUser === null
          ? this.renderForm()
          : this.renderConfirmationForm() }
      </div>
    );
  }
}

export default withRouter(CreateAccount);