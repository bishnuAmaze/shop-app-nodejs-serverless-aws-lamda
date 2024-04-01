import { APIGatewayProxyEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';
import { createProductHandler } from 'src/createProduct';

const productData = {
  title: "Test title",
  description: "Test description",
  price: 100,
  count: 1
};

beforeEach(() => {
  AWSMock.setSDKInstance(AWS);
});

afterEach(() => {
  AWSMock.restore('DynamoDB.DocumentClient');
});

test('successfully creates a product', async () => {
  AWSMock.mock('DynamoDB.DocumentClient', 'put', (_: any, callback: Function) => {
    callback(null, "successfully put item");
  });

  const event: APIGatewayProxyEvent = {
    body: JSON.stringify(productData),
    // add other required event fields as necessary
  } as any;

  const response = await createProductHandler(event);

  expect(response.statusCode).toEqual(200);
  expect(response.body).toEqual(JSON.stringify(productData));
});

test('returns an error when a required field is missing', async () => {
  const event: APIGatewayProxyEvent = {
    body: JSON.stringify({}),
  } as any;

  const response = await createProductHandler(event);

  expect(response.statusCode).toEqual(400);
  expect(JSON.parse(response.body).message).toEqual("Invalid Product Data - Missing title");
});

test('returns an error when DynamoDB operation fails', async () => {
  AWSMock.mock('DynamoDB.DocumentClient', 'put', (_: any, callback: Function) => {
    callback(new Error('DynamoDB error'), null);
  });

  const event: APIGatewayProxyEvent = {
    body: JSON.stringify(productData),
  } as any;

  const response = await createProductHandler(event);

  expect(response.statusCode).toEqual(500);
  expect(JSON.parse(response.body).message).toEqual("DynamoDB error");
});