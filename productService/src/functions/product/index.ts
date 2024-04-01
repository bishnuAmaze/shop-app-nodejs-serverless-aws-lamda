// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export const Products = {
  handler: `${handlerPath(__dirname)}/handler.getProductsList`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true
      }
    }
  ]
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

export const CreateProduct = {
  handler: `${handlerPath(__dirname)}/handler.createProduct`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: true,
        // reqValidatorName: '${self:custom.reqValidatorName}',
        // documentation: {
        //   summary: "Create a product",
        //   description: "Create a product",
        //   requestBody: {
        //     description: "Create product body data",
        //   },
        //   requestModel: 'Product'
        // }
      }
    }
  ]
};