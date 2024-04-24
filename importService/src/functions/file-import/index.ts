import { handlerPath } from '@libs/handler-resolver';

export const ImportProductsFile = {
  handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
  events: [
    {
      http: {
        method: 'GET',
        cors: true,
        path: '/import',
        authorizer: {
          type: 'token',
          name: 'authorization-service-dev-Authorizer',
          arn: 'arn:aws:lambda:us-east-1:058264555641:function:authorization-service-dev-Authorizer',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
        },
      }
    }
  ],
};

export const ImportFileParser = {
  handler: `${handlerPath(__dirname)}/handler.importFileParser`,
  events: [
    {
      s3: {
        bucket: 'bkbuploadfiles',
        event: 's3:ObjectCreated:*',
        existing: true,
        rules: [
          {
            prefix: 'uploaded',
          }
        ]
      }
    },
  ]
};
