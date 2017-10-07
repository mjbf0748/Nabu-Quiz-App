
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { invokeApig } from '../libs/awsLib';

class TimedQuiz extends Component {
    constructor(props) {
        super(props);

        this.state = {
            quiz: {},
            questions:[],
            user_answers: [],
            answer:[],
            test: [],
            step: 0
        };
        this.selectAnswer = this.selectAnswer.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.newQuestion = this.newQuestion.bind(this);


    }

    getQuiz() {
        return invokeApig({ path: `/quizzes1/${this.props.match.params.id}` }, 
        this.props.userToken);
   }


    async componentDidMount() {
        try {
            const result = await this.getQuiz();
            this.setState({
                quiz: result,
                questions: result.questions.Questions[this.state.step],
                answer: result.questions.Questions[this.state.step].Answers,
                quizLength: result.questions.Questions.length
            });
            for (var i = 0; i < result.questions.Questions.length; i++) {
                for (var j = 0; j < result.questions.Questions[i].Answers.length; j++) {
                    if (result.questions.Questions[i].Answers[j].correct == true) {
                        this.state.test[i] = result.questions.Questions[i].Answers[j].answer;
                    }
                }
            }
                
        } catch(e) {
            console.log(e);
            alert(e);
        }
    }

    nextStep() {
        this.setState({
                step: this.state.step + 1
            });
        var steps = this.state.step + 1;
        if (steps < this.state.quizLength) {
            this.newQuestion(steps);
    }        
}
    
    newQuestion(stepper) {
        this.setState({
                questions: this.state.quiz.questions.Questions[stepper],
                answer: this.state.quiz.questions.Questions[stepper].Answers,
                correct: this.state.quiz.questions.Questions[stepper].Answers[0].correct
            });
    }
    
 

    selectAnswer(event) {
        var user = this.state.user_answers;
        user[this.state.step] = event.target.value;
        this.setState({user_answers: user});  
    }

    
    computeScore() {
        var score = 0;
        for (var i = 0; i < this.state.user_answers.length; i++) {
            if (this.state.user_answers[i] == this.state.test[i]) {
            score++;
        }
    }
        return (score/this.state.test.length) * 100; 
    }


    renderResult(){
        return (<div>{this.computeScore()}</div>)
    }

    render() {
        const choice = ['A', 'B', 'C', 'D']
        let answerNodes = this.state.answer.map((value,index) => 
         <div>
            <input
                id={"answer-input" + index}
                type="radio"
                value={this.state.answer[index].answer}
                onChange={this.selectAnswer}
                checked={this.state.user_answers[this.state.step] === this.state.answer[index].answer} />
            <label htmlFor={"answer-input" + index}>
                {choice[index] + ". " + this.state.answer[index].answer}
            </label>
        </div>
    );
 
        return (
            <div className = "App">
                <h1>{this.state.quiz.quizName}</h1>
                    {(this.state.step < this.state.quizLength ?
                    <form>
                        <h4>{(parseInt(this.state.step) + 1) + ": " + this.state.questions.title}?</h4>
                        {answerNodes} 
                        <br/>

                        <button type="button" onClick={this.nextStep}>
                            Next
                        </button>
                    </form> 
                    : <div>You scored{(this.renderResult())}</div>
                    )}
            </div>
        )
    }

}

export default withRouter(TimedQuiz);
