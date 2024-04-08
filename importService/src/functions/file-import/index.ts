import { handlerPath } from '@libs/handler-resolver';

export const ImportProductsFile = {
  handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
  events: [
    {
      httpApi: {
        method: 'GET',
        path: '/${self:provider.stage}/import',
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
