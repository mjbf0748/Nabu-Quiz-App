import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
  const params = {
    TableName: 'quizzes2',
    // Here you only define the table name and run scan to return everything.  
  };

  try {
    const result = await dynamoDbLib.call('scan', params);
    // Return the matching list of items in response body
    callback(null, success(result.Items));
  }
  catch(e) {
    console.log(e);
    callback(null, failure({status: false}));
  }
};