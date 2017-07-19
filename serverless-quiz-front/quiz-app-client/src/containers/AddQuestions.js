import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import './AddQuestions.css';
import Form from "react-jsonschema-form";
import LoaderButton from '../components/LoaderButton';
import { invokeApig, s3Upload, } from '../libs/awsLib';
import config from '../config.js';


class AddQuestions extends Component {
    constructor(props) {
        super(props);

        this.file = null;
        this.questions = null;

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
            questions: results.questions
        });
    }
    catch(e) {
    console.log(e);
    alert(e);
    }
  }



  getQuiz() {
    return invokeApig({ path: `/quizzes1/${this.props.match.params.id}` }, this.props.userToken);
  }

  createQuestions(qs) {
    return invokeApig({
      path: '/quizzes1',
      method: 'POST',
      body: qs,
    }, this.props.userToken);
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      const uploadedFilename = ("questions_for_quiz")
        ? (await s3Upload(this.file, this.props.userToken)).Location
        : null;

      this.props.history.push('/');
    }
    catch(e) {
      console.log(e);
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


const formData = {
  "questions": [
    {
        "unorderable": ["1", "2"],
        "done": false
    }
  ]
};

const log = (type) => console.log.bind(console, type);

    return (
      <Form className="App"
       schema={schema}
            uiSchema={uiSchema}
            formData={formData}
        onChange={log("changed")}
        onSubmit={log("submitted")}
        onError={log("errors")} />
    );
  }
}


export default withRouter(AddQuestions);