import { middyfy } from '@libs/lambda';
import { getAllProductsHandler } from 'src/getProductsList';
import { getProductsByIdHandler } from 'src/getProductsById';
import { createProductHandler } from 'src/createProduct';
import { catalogBatchProcessHandler } from 'src/catalogBatchProcess';

export const getProductsList = middyfy(getAllProductsHandler);
export const getProductsById = middyfy(getProductsByIdHandler);
export const createProduct = middyfy(createProductHandler);
export const catalogBatchProcess = catalogBatchProcessHandler;
