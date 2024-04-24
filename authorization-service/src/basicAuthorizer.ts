import {
  APIGatewayTokenAuthorizerHandler,
  APIGatewayTokenAuthorizerEvent,
  Context,
} from "aws-lambda";

export const basicAuthorizerHandler: APIGatewayTokenAuthorizerHandler = async (
  event: APIGatewayTokenAuthorizerEvent,
  _context: Context
) => {
  try {
    if (!event.authorizationToken) {
      throw new Error("Unauthorized");
    }

    const [type, encodedCreds] = event.authorizationToken.split(" ");

    if (type !== "Basic") {
      throw new Error("Unauthorized");
    }

    const buff = Buffer.from(encodedCreds, "base64");
    const [username, password] = buff.toString("utf-8").split(":");

    console.log("BKB", username, password);

    const storedUserPassword = process.env[username];

    console.log("BKB", storedUserPassword);

    return {
      principalId: encodedCreds,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: storedUserPassword !== password ? "Deny" : "Allow",
            Resource: "*",
          },
        ],
      },
    };
  } catch (error) {
    throw new Error("Internal server error"); // Or any other error handling logic you want
  }
};
