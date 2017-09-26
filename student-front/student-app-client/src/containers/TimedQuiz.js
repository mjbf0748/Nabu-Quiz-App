
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { invokeApig } from '../libs/awsLib';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import QuestionCount from '../components/QuestionCount';
import Quiz from '../components/TQuiz';
import Result from '../components/Result'

class TimedQuiz extends Component {
    constructor(props) {
        super(props);

        this.state = {
            quiz: {},
            user_answers: [],
            step: 0
        };
    }

    getQuiz() {
        return invokeApig({ path: `/quizzes1/${this.props.match.params.id}` }, 
        this.props.userToken);
   }


    async componentDidMount() {
        try {
            const result = await this.getQuiz();
    
            this.setState({
                quiz: result
            });
        } catch(e) {
            console.log(e);
            alert(e);
        }
    }

    nextStep() {
        this.setState({step: (this.state + 1)});
    }

    setAnswer(event) {
        this.state.user_answers[this.state.step] = this.state.user_answers[this.state.step] || [];
        this.state.user_answers[this.state.step][parseInt(event.target.value)] = event.target.chcecked;
    }

    isAnswerRight(index) {
        const result = true;

    }

    render() {
        return (
            <div className = "App">
                <h1>{this.state.quiz.quizName}</h1>

            </div>
        )
    }


}

export default withRouter(TimedQuiz);
