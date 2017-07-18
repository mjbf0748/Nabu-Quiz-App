import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  FormGroup,
  FormControl,
  ControlLabel,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import { invokeApig, s3Upload, } from '../libs/awsLib';
import config from '../config.js';
import './Quizzes.css';

class Quizzes extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      quiz: null,
      category: '',
      quizName: '',
      subject: '',
      image: ''
    };
  }

  async componentDidMount() {
    try {
      const results = await this.getQuiz();
      this.setState({
        quiz: results,
        category: results.category,
        quizName: results.quizName,
        subject: results.subject,
        image: results.image,
      });
    }
    catch(e) {
      console.log(e);
      alert(e);
    }
  }

  getQuiz() {
    return invokeApig({ path: `/quizzes/${this.props.match.params.id}` }, this.props.userToken);
  }

  saveQuiz(quiz) {
    return invokeApig({
      path: `/quizzes/${this.props.match.params.id}`,
      method: 'PUT',
      body: quiz,
    }, this.props.userToken);
  }

  deleteQuiz() {
    return invokeApig({
      path: `/quizzes/${this.props.match.params.id}`,
      method: 'DELETE',
    }, this.props.userToken);
  }

  validateForm() {
    return this.state.category.length > 0;
  }

  formatFilename(str) {
    return (str.length < 50)
      ? str
      : str.substr(0, 20) + '...' + str.substr(str.length - 20, str.length);
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
    let uploadedFilename;

    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert('Please pick a file smaller than 5MB');
      return;
    }

    this.setState({ isLoading: true });

    try {

      if (this.file) {
        uploadedFilename = (await s3Upload(this.file, this.props.userToken)).Location;
      }

      await this.saveQuiz({
        ...this.state.quiz,
        category: this.state.category,
        image: uploadedFilename || this.state.quiz.image,
      });
      this.props.history.push('/');
    }
    catch(e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  handleDelete = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm('Are you sure you want to delete this quiz?');

    if ( ! confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deleteQuiz();
      this.props.history.push('/');
    }
    catch(e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  render() {
    return (
      <div className="Quizzes">
        { this.state.quiz &&
          ( <form onSubmit={this.handleSubmit}>
              <FormGroup controlId="quizName">
                <FormControl
                  onChange={this.handleChange}
                  value={this.state.quizName}
                  componentClass="textarea" />
              </FormGroup>
              { this.state.quiz.image &&
              ( <FormGroup>
                <ControlLabel>Image</ControlLabel>
                <FormControl.Static>
                  <a target="_blank" rel="noopener noreferrer" href={ this.state.quiz.image }>
                    { this.formatFilename(this.state.quiz.image) }
                  </a>
                </FormControl.Static>
              </FormGroup> )}
              <FormGroup controlId="file">
                { ! this.state.quiz.image &&
                <ControlLabel>Image</ControlLabel> }
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
                text="Save"
                loadingText="Saving…" />
              <LoaderButton
                block
                bsStyle="danger"
                bsSize="large"
                isLoading={this.state.isDeleting}
                onClick={this.handleDelete}
                  text="Delete"
                  loadingText="Deleting…" />
            </form> )}
        </div>
      );
  }

}

export default withRouter(Quizzes);