import { middyfy } from '@libs/lambda';
import { getAllProductsHandler } from 'src/getProductsList';
import { getProductsByIdHandler } from 'src/getProductsById';

export const getProductsList  = middyfy(getAllProductsHandler());
export const getProductsById  = middyfy(getProductsByIdHandler());
