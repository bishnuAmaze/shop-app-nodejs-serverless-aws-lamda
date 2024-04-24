import type { AWS } from "@serverless/typescript";

import { Authorizer } from "@functions/authorizer";

const serverlessConfiguration: AWS = {
  service: "authorization-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-dotenv-plugin"],
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    stage: "dev",
    region: "us-east-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  // import the function via paths
  functions: { Authorizer },
  resources: {
    Outputs: {
      LambdaAuthorizerArn: {
        Description: "The ARN of the lambda basicAuthorizer function",
        Value: {
          "Fn::GetAtt": ["AuthorizerLambdaFunction", "Arn"],
        },
        Export: {
          Name: "BasicAuthorizerArn",
        },
      },
    },
  },
  package: { individually: true },
  custom: {
    dotenv: {
      path: "./.env",
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
