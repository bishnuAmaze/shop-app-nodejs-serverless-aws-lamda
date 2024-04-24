import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  "Content-Type": "application/json",
  'Access-Control-Allow-Credentials': true,
};

export const formatJSONResponse = (response: Record<string, unknown>) => {
  const statusCode = response && typeof response.status === 'number' ? response.status : 200;
  const body = response && typeof response.body === 'object' ? response.body : {};
  return {
    statusCode: statusCode,
    headers: {
      ...defaultHeaders
    },
    body: JSON.stringify(body),
    isBase64Encoded: false
  }
}
