import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Radio
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import config from '../config.js';
import './NewQuiz.css';
import { invokeApig, s3Upload } from '../libs/awsLib';

class NewQuiz extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      quizName: '',
    };
  }


  validateForm() {
    return this.state.quizName.length > 0;
  }

  createQuiz(quiz) {
    return invokeApig({
      path: '/quizzes',
      method: 'POST',
      body: quiz,
    }, this.props.userToken);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = (event) => {
    this.file = event.target.files[0];
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert('Please pick a file smaller than 5MB');
      return;
    }

    this.setState({ isLoading: true });

    try {
        await this.createQuiz({
        category: this.state.category,
        quizName: this.state.quizName,
        subject: this.state.subject,
        });
        this.props.history.push('/');
    }
    catch(e) {
        console.log(e);
        alert(e);
        this.setState({ isLoading: false });
    }
  }



  render() {
    return (
      <div className="NewQuiz">
        <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="quizName">
            <FormControl 
                onChange={this.handleChange} 
                value={this.state.quizName}
             type="text" placeholder="Quiz Name" />
            </FormGroup>
            <FormGroup controlId="category">
            <Radio name="radioGroup" value="SAT" onChange={this.handleChange} inline>
                SAT
            </Radio>
            {' '}
            <Radio name="radioGroup" value="ACT" onChange={this.handleChange} inline>
                ACT
            </Radio>
            {' '}
            </FormGroup>

            <FormGroup controlId="subject">
            <ControlLabel>Subject</ControlLabel>
            <FormControl componentClass="select" placeholder="select">
                <option value="reading">Reading</option>
                <option value="math">Math</option>
            </FormControl>
            </FormGroup>

          <FormGroup controlId="file">
            <ControlLabel>Image</ControlLabel>
            <FormControl
              onChange={this.handleFileChange}
              type="file" />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={ ! this.validateForm() }
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating…" />
        </form>
      </div>
    );
  }
}

export default withRouter(NewQuiz);