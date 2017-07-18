//OLD IMPORTS (Why isn't import AWS in new one?)
//import uuid from 'uuid';
//import AWS from 'aws-sdk';
//AWS.config.update({region:'us-east-1'});
//const dynamoDb = new AWS.DynamoDB.DocumentClient();

import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: 'quizzes1',
    // 'Item' contains the attributes of the item to be created
    // - 'userId': because users are authenticated via Cognito User Pool, we
    //             will use the User Pool sub (a UUID) of the authenticated user
    // - 'quizId': a unique uuid
    // - 'category': parsed from request body
    // - 'subject': parsed from request body
    // - 'name': parsed from request body
    // - 'questions': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    Item: {
      userId: event.requestContext.authorizer.claims.sub,
      quizId: uuid.v1(),
      category: data.category,
      subject: data.subject,
      quizName: data.quizName,
      questions: data.questions,
      image: data.image,
      createdAt: new Date().getTime(),
    },
  };

  try {
    const result = await dynamoDbLib.call('put', params);
    callback(null, success(params.Item));
  }
  catch(e) {
    console.log(e);
    callback(null, failure({status: false}));
  }
};
