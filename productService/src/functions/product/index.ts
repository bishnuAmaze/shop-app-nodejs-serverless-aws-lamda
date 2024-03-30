// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export const Products = {
  handler: `${handlerPath(__dirname)}/handler.getProductsList`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: {
          origin: '*',
          headers: [
            'Content-Type',
            'X-Amz-Date',
            'Authorization',
            'X-Api-Key',
            'X-Amz-Security-Token',
            'X-Amz-User-Agent',
          ],
          allowCredentials: true,
        },
        // request: {
        //   schemas: {
        //     'application/json': schema,
        //   },
        // },
      },
    },
  ],
};

export const ProductById = {
  handler: `${handlerPath(__dirname)}/handler.getProductsById`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        cors: true,
        request: {
          parameters: {
            paths: {
              productId: true
            }
          }
        },
      },
    },
  ],
};