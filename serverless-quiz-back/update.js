import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: 'quizzes1',
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': User Pool sub of the authenticated user
    // - 'noteId': path parameter
    Key: {
      //userId: event.requestContext.authorizer.claims.sub,
      userId: event.requestContext.authorizer.claims.sub,
      quizId: event.pathParameters.id,
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: 'SET quizName = :quizName, image = :image,subject = :subject,category = :category,questions = :questions ',
    ExpressionAttributeValues: {
      ':quizName': data.quizName ? data.quizName : null,
      ':image': data.image ? data.image : null,
      ':category': data.category ? data.category : null,
      ':subject': data.subject ? data.subject : null,
      ':questions': data.questions ? data.questions : null,
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamoDbLib.call('update', params);
    callback(null, success({status: true}));
  }
  catch(e) {
    console.log(e);
    callback(null, failure({status: false}));
  }
};