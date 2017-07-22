import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import './AddQuestions.css';
import Form from "react-jsonschema-form";
import LoaderButton from '../components/LoaderButton';
import { invokeApig, s3Upload, s3QuestionsUpload} from '../libs/awsLib';
import config from '../config.js';

class AddQuestions extends Component {
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
      image: '',
      questions: ''
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
        questions: results.questions
      });
    }
    catch(e) {
      console.log(e);
      alert(e);
    }
  }
  getQuiz() {
    return invokeApig({ path: `/quizzes1/${this.props.match.params.id}` }, 
    this.props.userToken);
  }
  saveQuiz(quiz) {
    return invokeApig({
      path: `/quizzes1/${this.props.match.params.id}`,
      method: 'PUT',
      body: quiz,
    }, this.props.userToken);
  }

  handleChange = (event) => {
    this.questions = event.formData
    console.log(this.questions)
  }

  
  handleSubmit = async (event) => {
    try {
      await this.saveQuiz({
        ...this.state.quiz,
        quizName: this.state.quizName,
        category: this.state.category,
        subject: this.state.subject,
        image: this.state.image,
        questions: this.questions,
      });
      this.props.history.push('/');
    }
    catch(e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }



  render() {

    const schema = {
        "type": "object",

        "properties": {
            "Questions": {
            "type": "array",
            "items": {
            "type": "object",

                "properties": {
                "title": {
                    "type": "string",
                    "title": "Question",
                    "description": "Add Question"
                },
                "Answers": {

                    "type": "array",
                    "items": {
                    "type": "object",
                        
                        "properties": {
                            "answer": {
                                "type": "string"
                            },
                            "correct": {
                                "type": "boolean",
                                "title": "Correct"
                            }
                        }
                    }

                },
                "Files": {
                    "type": "string",
                    "format": "data-url",
                    "title": "Image"
                }

              }
            }
          }
        }
    };

const uiSchema = {
  "questions": {
    "items": { 
      "answers": {
        "items": {
        "ui:options": {"orderable": false }
        }
      }
    }
  }
};

const formData = {};


    


const log = (type) => console.log.bind(console, type);
 return (
    <Form className="App"
        schema={schema}
        uiSchema={uiSchema}
        formData={this.questions}
        value={formData}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        onError={log("errors")}
        type='json'
    />
    );
 
  }
}

export default withRouter(AddQuestions);