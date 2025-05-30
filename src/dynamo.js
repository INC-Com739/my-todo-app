import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';

const REGION = import.meta.env.VITE_APP_AWS_REGION;
const ACCESS_KEY_ID = import.meta.env.VITE_APP_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = import.meta.env.VITE_APP_AWS_SECRET_ACCESS_KEY;

const client = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

const ddbDocClient = DynamoDBDocumentClient.from(client);

export async function scanTodos() {
  const command = new ScanCommand({ TableName: 'Todo' });
  const result = await ddbDocClient.send(command);
  return result.Items || [];
}

export async function createTodo(item) {
  const command = new PutCommand({ TableName: 'Todo', Item: item });
  await ddbDocClient.send(command);
}
export async function updateTodo(item) {
  const command = new UpdateCommand({
    TableName: 'Todo',
    Key: { id: item.id },
    UpdateExpression: 'set #text = :text, completed = :completed',
    ExpressionAttributeNames: {
      '#text': 'text',
    },
    ExpressionAttributeValues: {
      ':text': item.text,
      ':completed': item.completed,
    },
  });
  await ddbDocClient.send(command);
}
export async function deleteTodo(id) {
  const command = new DeleteCommand({
    TableName: 'Todo',
    Key: { id },
  });
  await ddbDocClient.send(command);
}
