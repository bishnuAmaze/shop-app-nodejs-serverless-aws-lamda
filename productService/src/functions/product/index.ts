// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export const Products = {
  handler: `${handlerPath(__dirname)}/handler.getProductsList`,
  events: [
    {
      httpApi: {
        method: 'GET',
        path: '/${self:provider.stage}/products',
      }
    }
  ]
};

export const ProductById = {
  handler: `${handlerPath(__dirname)}/handler.getProductsById`,
  events: [
    {
      httpApi: {
        method: 'GET',
        path: '/${self:provider.stage}/products/{productId}',
      },
    },
  ],
};

export const CreateProduct = {
  handler: `${handlerPath(__dirname)}/handler.createProduct`,
  events: [
    {
      httpApi: {
        method: 'POST',
        path: '/${self:provider.stage}/products',
      }
    }
  ]
};