import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Displays.css';
import {
  ListGroup,
  ListGroupItem
} from 'react-bootstrap';
import { invokeApig } from '../../libs/awsLib';

class SATmath extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      quizzes: [],
    };
  }

  async componentDidMount() {
    if (this.props.userToken === null) {
      return;
    }
    this.setState({ isLoading: true });
    try {
      const results = await this.quizzes();
      this.setState({ quizzes: results });
    }
    catch(e) {
      alert(e);
    }
    this.setState({ isLoading: false });
  }

  quizzes() {
    return invokeApig({ path: '/quizzes1' }, this.props.userToken);
  }

  handleQuizClick = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  renderQuizList(quizzes) {
    return [{}].concat(quizzes).map((quiz, i) => (
      i !== 0 &&
      quiz.category ==='SAT' &&
      quiz.subject ==='math'
        ? ( <ListGroupItem
              key={quiz.quizId}
              href={`/TimedQuiz/${quiz.quizId}`}
              onClick={this.handleQuizClick}
              header={quiz.quizName}>
            </ListGroupItem> )
        : ( <ListGroupItem
              key="new"
              href="/TimedSATmath"
              onClick={this.handleQuizClick}>
                <h4> Practice With Video Explanations!</h4>
            </ListGroupItem> )
    ));
  }



renderQuizzes() {
    return (
      <div className="quizzes">
        <h1>SAT Math Quizzes</h1>
        <ListGroup>
          { ! this.state.isLoading
            && this.renderQuizList(this.state.quizzes) }
        </ListGroup>
      </div>
    );
  }



  render() {
    //return [{}].concat(quizzes).map((quiz, i) => (
    //i !== 0
    //));
    return(
    this.renderQuizzes()
    );
  }
}
export default withRouter(SATmath);