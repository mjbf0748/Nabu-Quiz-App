import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
  const params = {
    TableName: 'quizzes1',
    // 'Key' defines the partition key and sort key of the item to be removed
    // - 'category: path parameter'
    // - 'noteId': path parameter
    Key: {
      //quizId: event.requestContext.authorizer.claims.sub,
      userId: event.requestContext.authorizer.claims.sub,
      quizId: event.pathParameters.id,
    },
  };

  try {
    const result = await dynamoDbLib.call('delete', params);
    callback(null, success({status: true}));
  }
  catch(e) {
    callback(null, failure({status: false}));
  }
};