import type { AWS } from '@serverless/typescript';

import { Products, ProductById, CreateProduct } from '@functions/product';

const serverlessConfiguration: AWS = {
  service: 'productservice',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-webpack', 'serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline', 'serverless-aws-documentation',
    'serverless-reqvalidator-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    region: 'eu-west-1',
    stage: 'dev',
    httpApi: {
      cors: true
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE: 'products',
      STOCKS_TABLE: 'stocks'
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:DescribeTable',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem'
        ],
        Resource: [
          { 'Fn::GetAtt': ['ProductsTable', 'Arn'] },
          { 'Fn::GetAtt': ['StocksTable', 'Arn'] }
        ]
      }
    ],
  },
  resources: {
    Resources: {
      ProductsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:provider.environment.PRODUCTS_TABLE}',
          AttributeDefinitions: [{
            AttributeName: 'id',
            AttributeType: 'S'
          }],
          KeySchema: [{
            AttributeName: 'id',
            KeyType: 'HASH'
          }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      },
      StocksTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:provider.environment.STOCKS_TABLE}',
          AttributeDefinitions: [{
            AttributeName: 'product_id',
            AttributeType: 'S'
          }],
          KeySchema: [{
            AttributeName: 'product_id',
            KeyType: 'HASH'
          }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      },
      ApiGatewayRestApi: {
        Type: 'AWS::ApiGateway::RestApi',
        Properties: {
          Name: '${self:provider.stage}-${self:service}', // replace with your service name and stage
        },
      },
      RequestValidatorFull: {
        Type: 'AWS::ApiGateway::RequestValidator',
        Properties: {
          RestApiId: { Ref: 'ApiGatewayRestApi' },
          Name: '${self:custom.reqValidatorName}',
          ValidateRequestBody: true,
          ValidateRequestParameters: true,
        },
        DependsOn: ['ApiGatewayRestApi'],
      },
    }
  },
  // import the function via paths
  functions: { Products, ProductById, CreateProduct },
  package: { individually: true },
  custom: {
    reqValidatorName: 'RequestValidatorFull',
    plugins: {
      'serverless-aws-documentation': {
        models: {
          // Define your payload model here
          'Product': {
            name: 'Product',
            description: 'Product data model',
            contentType: 'application/json',
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number' },
                count: { type: 'number' },
              },
              required: ['title', 'description', 'price', 'count']
            },
          }
        },
      },
    },
    dynamodb: {
      stages: 'dev',
      start: {
        port: 8000,
        inMemory: true,
        migrate: true
      },
      dir: 'C:\\dynamodb_local_latest'
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: false,
      exclude: [],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
