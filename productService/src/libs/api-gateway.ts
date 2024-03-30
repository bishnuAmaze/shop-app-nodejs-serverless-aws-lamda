import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

const defaultHeaders = {
  // "Access-Control-Allow-Credentials": false,
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  // "Access-Control-Allow-Headers": "*",
  // "Content-Type": "application/json",
};

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: response.status,
    headers: {
      ...defaultHeaders
    },
    body: JSON.stringify(response.body)
  }
}
